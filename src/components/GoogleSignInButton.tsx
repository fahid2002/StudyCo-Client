'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { api } from '@/lib/axios';
import { useAuth } from '@/lib/auth-context';

interface GoogleSignInButtonProps {
  mode: 'login' | 'register';
  onError: (message: string) => void;
  onExistingAccount?: () => void;
}

export function GoogleSignInButton({ mode, onError, onExistingAccount }: GoogleSignInButtonProps) {
  const { login } = useAuth();
  const startGoogleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/auth/google', {
          accessToken: tokenResponse.access_token,
          mode,
        });
        login(res.data.data.token, res.data.data.user);
        window.location.href = '/';
      } catch (err) {
        const message = (err as Error).message;
        if (mode === 'register' && message.toLowerCase().includes('already exists')) {
          onExistingAccount?.();
          return;
        }
        onError(message);
      }
    },
    onError: () => onError('Google sign-in failed. Please try again.'),
  });

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        className="w-full py-3 rounded-xl border border-black/10 dark:border-white/15 font-semibold opacity-60"
      >
        Google sign-in not configured
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => startGoogleLogin()}
      className="w-full py-3 rounded-xl border border-black/10 dark:border-white/15 font-semibold bg-white dark:bg-[#12151C] hover:border-primary"
    >
      Continue with Google
    </button>
  );
}
