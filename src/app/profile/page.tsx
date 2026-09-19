'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { api } from '@/lib/axios';
import { ApiEnvelope, AuthUser } from '@/types';

interface ProfileResponse {
  token: string;
  user: AuthUser;
}

function ProfileContent() {
  const { user, token, login } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhotoUrl(user.photoUrl ?? '');
    }
  }, [user]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.patch<ApiEnvelope<ProfileResponse>>('/auth/me/profile', { name, photoUrl });
      const updated = response.data.data;
      login(updated.token || token || '', updated.user);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Dashboard</p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">My Profile</h1>
      <p className="text-sm text-ink/60 dark:text-white/50 mt-2">Manage the information shown on your StudyCo account.</p>

      <form onSubmit={saveProfile} className="mt-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div
            className="h-20 w-20 shrink-0 rounded-full bg-coral bg-cover bg-center text-white flex items-center justify-center text-xl font-bold"
            style={photoUrl ? { backgroundImage: `url(${photoUrl})` } : undefined}
          >
            {!photoUrl && name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold">{name || 'Your profile'}</p>
            <p className="text-sm text-ink/50 dark:text-white/40">{user?.email}</p>
          </div>
        </div>

        <label className="mt-8 block text-sm font-medium" htmlFor="profile-name">Name</label>
        <input
          id="profile-name"
          required
          minLength={2}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-white/15 dark:bg-[#12151C]"
        />

        <label className="mt-5 block text-sm font-medium" htmlFor="profile-email">Email Address</label>
        <input
          id="profile-email"
          value={user?.email ?? ''}
          readOnly
          className="mt-1 w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm text-ink/50 dark:border-white/15 dark:bg-white/5 dark:text-white/40"
        />

        <label className="mt-5 block text-sm font-medium" htmlFor="profile-photo">Profile Photo URL</label>
        <input
          id="profile-photo"
          type="url"
          value={photoUrl}
          onChange={(event) => setPhotoUrl(event.target.value)}
          placeholder="https://example.com/your-photo.jpg"
          className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-white/15 dark:bg-[#12151C]"
        />
        <p className="mt-2 text-xs text-ink/45 dark:text-white/40">Use a public http or https image URL.</p>

        <button type="submit" disabled={saving} className="mt-7 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-paper disabled:opacity-50">
          {saving ? 'Saving...' : 'Update profile'}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
