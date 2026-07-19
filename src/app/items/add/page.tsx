'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { api } from '@/lib/axios';

const SUBJECTS = ['Mathematics', 'Computer Science', 'Languages', 'Sciences', 'Business', 'Test Prep'];

function AddSessionForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', shortDescription: '', fullDescription: '',
    price: '', date: '', level: 'Beginner', subject: 'Mathematics', mode: 'Online', imageUrl: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(false); setLoading(true);
    try {
      await api.post('/sessions', { ...form, price: Number(form.price) });
      setSuccess(true);
      setForm({ title: '', shortDescription: '', fullDescription: '', price: '', date: '', level: 'Beginner', subject: 'Mathematics', mode: 'Online', imageUrl: '' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-semibold">Host a new session</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input required value={form.title} onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Discrete Math Problem Set Review"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Short description</label>
          <input required value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)}
            placeholder="One line for the listing card"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Full description</label>
          <textarea required rows={4} value={form.fullDescription} onChange={(e) => update('fullDescription', e.target.value)}
            placeholder="What will the group cover?"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price (USD)</label>
            <input required type="number" min={0} value={form.price} onChange={(e) => update('price', e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium">Date &amp; time</label>
            <input required type="datetime-local" value={form.date} onChange={(e) => update('date', e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Subject</label>
            <select value={form.subject} onChange={(e) => update('subject', e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm">
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Level</label>
            <select value={form.level} onChange={(e) => update('level', e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Format</label>
          <select value={form.mode} onChange={(e) => update('mode', e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm">
            <option>Online</option><option>In-person</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Cover image URL (optional)</label>
          <input type="url" value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)}
            placeholder="https://…"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          {form.imageUrl && (
            <div className="mt-3 h-32 rounded-xl bg-cover bg-center border border-black/10 dark:border-white/10" style={{ backgroundImage: `url(${form.imageUrl})` }} />
          )}
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
        <button disabled={loading} className="px-6 py-3 rounded-xl bg-primary text-paper font-semibold disabled:opacity-50">
          {loading ? 'Publishing…' : 'Publish session'}
        </button>
        {success && <p className="text-sm text-primary dark:text-primary-light">Session published — it now appears in Manage sessions.</p>}
      </form>
    </div>
  );
}

export default function AddSessionPage() {
  return (
    <ProtectedRoute>
      <AddSessionForm />
    </ProtectedRoute>
  );
}
