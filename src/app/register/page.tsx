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

import styles from './Register.module.scss';

const RegisterForm = observer(function RegisterForm() {
  const { authStore, cartStore } = useRootStore();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') ?? '/';
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authStore.error = null;
    try {
      await authStore.register(username.trim(), email.trim(), password);
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
              required
              className={styles.input}
            />
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
              required
              className={styles.input}
            />
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
              required
              className={styles.input}
            />
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
