'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useAuth } from '@/lib/auth-context';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email address.';
    if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.data.token, res.data.data.user);
      router.push('/');
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function useDemoAccount() {
    setLoading(true);
    setServerError('');
    setEmail('demo.student@studyco.app');
    setPassword('demo1234');
    try {
      const res = await api.post('/auth/demo-login');
      login(res.data.data.token, res.data.data.user);
      router.push('/');
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-center">Welcome back</h1>
      <form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-[#1B1F29] border border-black/5 dark:border-white/10 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && <p className="text-xs text-coral mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.password && <p className="text-xs text-coral mt-1">{errors.password}</p>}
        </div>
        {serverError && <p className="text-xs text-coral">{serverError}</p>}
        <button disabled={loading} className="w-full py-3 rounded-xl bg-primary text-paper font-semibold disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <button type="button" onClick={useDemoAccount} className="w-full py-3 rounded-xl border border-amber text-amber-light font-semibold">
          Use demo account
        </button>
        <GoogleSignInButton onError={setServerError} />
        <p className="text-sm text-center text-ink/60 dark:text-white/50">
          No account? <Link href="/register" className="font-semibold text-primary dark:text-primary-light">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
