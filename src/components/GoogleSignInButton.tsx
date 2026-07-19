'use client';

import { GoogleLogin } from '@react-oauth/google';
import { api } from '@/lib/axios';
import { useAuth } from '@/lib/auth-context';

export function GoogleSignInButton({ onError }: { onError: (message: string) => void }) {
  const { login } = useAuth();

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
    <div className="flex justify-center">
      <GoogleLogin
        width="320"
        onSuccess={async (credentialResponse) => {
          try {
            const idToken = credentialResponse.credential;
            if (!idToken) throw new Error('Google did not return an identity token.');
            const res = await api.post('/auth/google', { idToken });
            login(res.data.data.token, res.data.data.user);
            window.location.href = '/';
          } catch (err) {
            onError((err as Error).message);
          }
        }}
        onError={() => onError('Google sign-in failed. Please try again.')}
      />
    </div>
  );
}
