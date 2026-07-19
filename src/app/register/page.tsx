'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data.data.token, res.data.data.user);
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-[#1B1F29] border border-black/5 dark:border-white/10 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required type="text"
            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email"
            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} type="password"
            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {error && <p className="text-xs text-coral">{error}</p>}
        <button disabled={loading} className="w-full py-3 rounded-xl bg-primary text-paper font-semibold disabled:opacity-50">
          {loading ? 'Creating…' : 'Create account'}
        </button>
        <p className="text-sm text-center text-ink/60 dark:text-white/50">
          Already have an account? <Link href="/login" className="font-semibold text-primary dark:text-primary-light">Log in</Link>
        </p>
      </form>
    </div>
  );
}
