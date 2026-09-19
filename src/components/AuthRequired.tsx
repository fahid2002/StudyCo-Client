'use client';

import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { buildLoginUrl } from '@/lib/redirect';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function AuthRequired({ children, featureName = 'this feature' }: { children: React.ReactNode; featureName?: string }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const returnTo = `${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`;

  if (loading) return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><LoadingSpinner label="Checking your account..." /></div>;

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#1B1F29] sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-primary-light"><LockKeyhole className="h-7 w-7" /></div>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-coral">Sign in required</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Unlock {featureName}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60 dark:text-white/50">Sign in to use StudyCo&apos;s AI-powered study tools and keep your work connected to your account.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={buildLoginUrl(returnTo)} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-paper">Log in to continue</Link>
            <Link href={`/register?returnTo=${encodeURIComponent(returnTo)}`} className="rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary dark:text-primary-light">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
