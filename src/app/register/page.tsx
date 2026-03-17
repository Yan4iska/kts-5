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

import styles from './Register.module.scss';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters'),
  email: z
    .string()
    .email('Email must be valid'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

type RegisterErrors = {
  username?: string;
  email?: string;
  password?: string;
};

const RegisterForm = observer(function RegisterForm() {
  const { authStore, cartStore } = useRootStore();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') ?? '/';
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authStore.error = null;
    setErrors({});

    const parsed = registerSchema.safeParse({
      username: username.trim(),
      email: email.trim(),
      password,
    });

    if (!parsed.success) {
      const fieldErrors: RegisterErrors = {};
      const formErrors = parsed.error.flatten();
      if (formErrors.fieldErrors.username?.[0]) {
        fieldErrors.username = formErrors.fieldErrors.username[0];
      }
      if (formErrors.fieldErrors.email?.[0]) {
        fieldErrors.email = formErrors.fieldErrors.email[0];
      }
      if (formErrors.fieldErrors.password?.[0]) {
        fieldErrors.password = formErrors.fieldErrors.password[0];
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await authStore.register(parsed.data.username, parsed.data.email, parsed.data.password);
      await cartStore.fetchCart();
      router.replace(returnUrl);
    } catch {
    }
  };

  return (
    <Container size="default">
      <div className={styles.page}>
        <Text tag="h1" view="title" className={styles.title}>
          Sign up
        </Text>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <Text tag="span" view="p-16" color="secondary" className={styles.label}>
              Username
            </Text>
            <Input
              type="text"
              value={username}
              onChange={setUsername}
              placeholder="Username"
              autoComplete="username"
              className={styles.input}
            />
            {errors.username && (
              <Text tag="p" view="p-14" color="secondary" className={styles.error}>
                {errors.username}
              </Text>
            )}
          </label>
          <label className={styles.field}>
            <Text tag="span" view="p-16" color="secondary" className={styles.label}>
              Email
            </Text>
            <Input
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Email"
              autoComplete="email"
              className={styles.input}
            />
            {errors.email && (
              <Text tag="p" view="p-14" color="secondary" className={styles.error}>
                {errors.email}
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
              autoComplete="new-password"
              className={styles.input}
            />
            {errors.password && (
              <Text tag="p" view="p-14" color="secondary" className={styles.error}>
                {errors.password}
              </Text>
            )}
          </label>
          {authStore.error && (
            <Text tag="p" view="p-16" className={styles.error}>
              {authStore.error}
            </Text>
          )}
          <Button type="submit" loading={authStore.loading} className={styles.submit}>
            Sign up
          </Button>
        </form>
        <Text tag="p" view="p-16" color="secondary" className={styles.footer}>
          Already have an account?{' '}
          <Link href={`/login${returnUrl !== '/' ? `?from=${encodeURIComponent(returnUrl)}` : ''}`} className={styles.link}>
            Log in
          </Link>
        </Text>
      </div>
    </Container>
  );
});

export default function Register() {
  return (
    <Suspense fallback={<Container size="default"><div className={styles.page}>Loading...</div></Container>}>
      <RegisterForm />
    </Suspense>
  );
}
