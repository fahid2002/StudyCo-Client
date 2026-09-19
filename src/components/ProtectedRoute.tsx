'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { buildLoginUrl } from '@/lib/redirect';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const returnTo = `${pathname}${window.location.search}`;
      router.replace(buildLoginUrl(returnTo));
    }
  }, [loading, user, pathname, router]);

  if (loading) return <div className="min-h-[40vh] flex items-center justify-center text-ink/40 dark:text-white/40">Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}

