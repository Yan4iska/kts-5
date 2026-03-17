'use client';
import Button from 'components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import Text from 'components/Text';
import { observer } from 'mobx-react-lite';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRootStore } from 'stores';
import { z } from 'zod';

import styles from './Login.module.scss';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type LoginErrors = {
  identifier?: string;
  password?: string;
};

const LoginForm = observer(function LoginForm() {
  const { authStore, cartStore } = useRootStore();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') ?? '/';
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authStore.error = null;
    setErrors({});

    const parsed = loginSchema.safeParse({
      identifier: identifier.trim(),
      password,
    });

    if (!parsed.success) {
      const fieldErrors: LoginErrors = {};
      const formErrors = parsed.error.flatten();
      if (formErrors.fieldErrors.identifier?.[0]) {
        fieldErrors.identifier = formErrors.fieldErrors.identifier[0];
      }
      if (formErrors.fieldErrors.password?.[0]) {
        fieldErrors.password = formErrors.fieldErrors.password[0];
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await authStore.login(parsed.data.identifier, parsed.data.password);
      await cartStore.fetchCart();
      router.replace(returnUrl);
    } catch {
    }
  };

  return (
    <Container size="default">
      <div className={styles.page}>
        <Text tag="h1" view="title" className={styles.title}>
          Log in
        </Text>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <Text tag="span" view="p-16" color="secondary" className={styles.label}>
              Email or username
            </Text>
            <Input
              type="text"
              value={identifier}
              onChange={setIdentifier}
              placeholder="Email or username"
              autoComplete="username"
              className={styles.input}
            />
            {errors.identifier && (
              <Text tag="p" view="p-14" color="secondary" className={styles.error}>
                {errors.identifier}
              </Text>
            )}
          </label>
          <label className={styles.field}>
            <Text tag="span" view="p-16" color="secondary" className={styles.label}>
              Password
            </Text>
            <Input
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Password"
              autoComplete="current-password"
              className={styles.input}
            />
          </label>
          {authStore.error && (
            <Text tag="p" view="p-16" className={styles.error}>
              {authStore.error}
            </Text>
          )}
          <Button type="submit" loading={authStore.loading} className={styles.submit}>
            Log in
          </Button>
        </form>
        <Text tag="p" view="p-16" color="secondary" className={styles.footer}>
          Don’t have an account?{' '}
          <Link href={`/register${returnUrl !== '/' ? `?from=${encodeURIComponent(returnUrl)}` : ''}`} className={styles.link}>
            Sign up
          </Link>
        </Text>
      </div>
    </Container>
  );
});

export default function Login() {
  return (
    <Suspense fallback={<Container size="default"><div className={styles.page}>Loading...</div></Container>}>
      <LoginForm />
    </Suspense>
  );
}
