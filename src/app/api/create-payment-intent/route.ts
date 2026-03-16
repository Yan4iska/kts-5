import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith('sk_')) return null;
  return new Stripe(key);
}

export type CreatePaymentIntentBody = {
  lineItems: Array<{
    documentId: string;
    productId: number;
    quantity: number;
    price: number;
  }>;
  discountPercent?: number;
};

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY (sk_test_...) to .env.local' },
      { status: 500 }
    );
  }
  let body: CreatePaymentIntentBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { lineItems, discountPercent } = body;
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return NextResponse.json(
      { error: 'lineItems must be a non-empty array' },
      { status: 400 }
    );
  }
  let totalCents = 0;
  for (const item of lineItems) {
    const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    const price = Number(item.price) || 0;
    totalCents += Math.round(price * 100 * qty);
  }
  if (totalCents <= 0) {
    return NextResponse.json(
      { error: 'Total amount must be positive' },
      { status: 400 }
    );
  }
  let amountCents = totalCents;
  if (
    discountPercent != null &&
    Number.isFinite(discountPercent) &&
    discountPercent >= 0 &&
    discountPercent <= 100
  ) {
    amountCents = Math.round(totalCents * (1 - discountPercent / 100));
    amountCents = Math.max(1, amountCents);
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amountCents,
      totalCents,
    });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Payment failed' },
      { status: 500 }
    );
  }
}
