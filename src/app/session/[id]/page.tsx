'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/hooks/useSessions';
import { SessionCard } from '@/components/SessionCard';
import { api } from '@/lib/axios';
import { useAuth } from '@/lib/auth-context';

type Tab = 'overview' | 'specs' | 'reviews' | 'related';

export default function SessionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, refetch } = useSession(id);
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [reserving, setReserving] = useState(false);

  if (isLoading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-ink/40">Loading session…</div>;
  if (!data) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-ink/40">Session not found.</div>;

  const { session, reviews, related } = data;
  const hostName = typeof session.host === 'string' ? 'Host' : session.host.name;

  async function reserve() {
    if (!user) { window.location.href = '/login'; return; }
    setReserving(true);
    try {
      await api.post(`/sessions/${id}/reserve`);
      await refetch();
    } finally {
      setReserving(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'specs', label: 'Key info' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'related', label: 'Related' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <div className="h-72 rounded-2xl bg-primary flex items-center justify-center text-7xl">📐</div>

        <h1 className="font-display text-3xl font-semibold mt-8">{session.title}</h1>
        <p className="text-ink/60 dark:text-white/50 mt-1">
          Hosted by {hostName} · ★ {session.ratingAverage.toFixed(1)} ({session.ratingCount} reviews) · {session.mode}
        </p>

        <div className="flex gap-6 mt-6 border-b border-black/10 dark:border-white/10 text-sm font-semibold">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 border-b-2 ${tab === t.key ? 'border-primary' : 'border-transparent text-ink/50 dark:text-white/40'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="py-6 text-sm leading-relaxed text-ink/70 dark:text-white/60">{session.fullDescription}</div>
        )}
        {tab === 'specs' && (
          <div className="py-6 text-sm grid grid-cols-2 gap-4">
            <div><p className="text-ink/40 dark:text-white/40 font-mono text-xs">FORMAT</p><p className="font-medium">{session.mode}</p></div>
            <div><p className="text-ink/40 dark:text-white/40 font-mono text-xs">LEVEL</p><p className="font-medium">{session.level}</p></div>
            <div><p className="text-ink/40 dark:text-white/40 font-mono text-xs">SEATS</p><p className="font-medium">{session.seatsReserved}/{session.seatsTotal}</p></div>
            <div><p className="text-ink/40 dark:text-white/40 font-mono text-xs">DATE</p><p className="font-medium">{new Date(session.date).toLocaleString()}</p></div>
          </div>
        )}
        {tab === 'reviews' && (
          <div className="py-6 space-y-4 text-sm">
            {reviews.length === 0 && <p className="text-ink/40 dark:text-white/40">No reviews yet.</p>}
            {(reviews as { _id: string; author: { name: string }; rating: number; comment: string }[]).map((r) => (
              <div key={r._id} className="border-b border-black/5 dark:border-white/10 pb-4">
                <p className="font-semibold">{'★'.repeat(r.rating)} {r.author.name}</p>
                <p className="text-ink/60 dark:text-white/50 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'related' && (
          <div className="py-6 grid sm:grid-cols-2 gap-4">
            {related.map((s) => <SessionCard key={s._id} session={s} />)}
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-black/5 dark:border-white/10 p-6 h-fit sticky top-24 bg-white dark:bg-[#1B1F29]">
        <p className="font-display text-2xl font-semibold">
          {session.price === 0 ? 'Free' : `$${session.price}`} <span className="text-sm font-normal text-ink/50 dark:text-white/40">/ session</span>
        </p>
        <p className="text-sm text-ink/50 dark:text-white/40 mt-1">Next: {new Date(session.date).toLocaleString()}</p>
        <button
          onClick={reserve}
          disabled={reserving || session.seatsReserved >= session.seatsTotal}
          className="w-full mt-5 py-3 rounded-xl bg-primary text-paper font-semibold disabled:opacity-50"
        >
          {session.seatsReserved >= session.seatsTotal ? 'Session full' : reserving ? 'Reserving…' : 'Reserve a seat'}
        </button>
        <p className="text-xs text-center text-ink/40 dark:text-white/40 mt-2">
          {session.seatsTotal - session.seatsReserved} seats left
        </p>
      </aside>
    </div>
  );
}
