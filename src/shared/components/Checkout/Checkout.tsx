'use client';

import Button from 'components/Button';
import Text from 'components/Text';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback, useState } from 'react';

import styles from './Checkout.module.scss';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise =
  publishableKey && publishableKey.startsWith('pk_')
    ? loadStripe(publishableKey)
    : null;

export type LineItem = {
  documentId: string;
  productId: number;
  quantity: number;
  price: number;
};

type CheckoutFormProps = {
  lineItems: LineItem[];
  discountPercent: number | null;
  totalLabel: string;
  onSuccess: () => void;
  onCancel?: () => void;
};

function CheckoutForm({
  lineItems,
  discountPercent,
  totalLabel,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      setError(null);
      setLoading(true);
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lineItems,
            discountPercent: discountPercent ?? undefined,
          }),
        });
        const contentType = res.headers.get('content-type');
        const isJson = contentType?.includes('application/json');
        let data: { error?: string; clientSecret?: string };
        if (isJson) {
          data = await res.json();
        } else {
          data = { error: 'Server error. Add STRIPE_SECRET_KEY (sk_test_...) to .env.local and restart.' };
        }
        if (!res.ok) {
          setError(data.error ?? 'Failed to create payment');
          setLoading(false);
          return;
        }
        if (!data.clientSecret) {
          setError(data.error ?? 'Invalid payment response');
          setLoading(false);
          return;
        }
        const cardEl = elements.getElement(CardElement);
        if (!cardEl) {
          setError('Card element not found');
          setLoading(false);
          return;
        }
        const { error: confirmError } = await stripe.confirmCardPayment(
          data.clientSecret,
          { payment_method: { card: cardEl } }
        );
        if (confirmError) {
          setError(confirmError.message ?? 'Payment failed');
          setLoading(false);
          return;
        }
        setSuccess(true);
        onSuccess();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment failed');
      } finally {
        setLoading(false);
      }
    },
    [stripe, elements, lineItems, discountPercent, onSuccess]
  );

  if (success) {
    return (
      <div className={styles.success}>
        <Text view="p-20" color="primary">
          Payment successful. Thank you for your order.
        </Text>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.totalRow}>
        <Text view="p-18" color="secondary">
          {totalLabel}
        </Text>
      </div>
      <div className={styles.cardWrap}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000',
                '::placeholder': { color: '#afadb5' },
              },
            },
          }}
        />
      </div>
      {error && (
        <div className={styles.error}>
          <Text view="p-16" color="secondary">
            {error}
          </Text>
        </div>
      )}
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || !stripe}>
          {loading ? 'Processing...' : 'Pay'}
        </Button>
      </div>
    </form>
  );
}

type CheckoutProps = {
  lineItems: LineItem[];
  discountPercent: number | null;
  totalLabel: string;
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function Checkout(props: CheckoutProps) {
  if (!stripePromise) {
    return (
      <div className={styles.error}>
        <Text view="p-18" color="secondary">
          Payment is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in
          .env.local (e.g. pk_test_...).
        </Text>
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
