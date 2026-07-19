'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/hooks/useSessions';
import { SessionCard } from '@/components/SessionCard';
import { api } from '@/lib/axios';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { downloadDocx } from '@/lib/document-utils';
import { useToggleBookmark } from '@/hooks/useStudyTools';

type Tab = 'overview' | 'specs' | 'reviews' | 'related';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80';

export default function SessionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, refetch } = useSession(id);
  const { user } = useAuth();
  const { showToast } = useToast();
  const bookmark = useToggleBookmark();
  const [tab, setTab] = useState<Tab>('overview');
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-ink/40">Loading session...</div>;
  if (!data) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-ink/40">Session not found.</div>;

  const { session, reviews, related } = data;
  const hostName = typeof session.host === 'string' ? 'Host' : session.host.name;
  const imageUrl = session.imageUrl || FALLBACK_IMAGE;

  async function reserve() {
    if (!user) { window.location.href = '/login'; return; }
    setReserving(true);
    setError('');
    try {
      await api.post(`/sessions/${id}/reserve`);
      await refetch();
      showToast(`Seat reserved for ${data?.session.title ?? 'this session'}.`, 'success');
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      showToast(message, 'error');
    } finally {
      setReserving(false);
    }
  }

  async function downloadRecap() {
    await downloadDocx({
      title: `Session recap: ${session.title}`,
      filename: `${session.title}-recap`,
      body: `${session.title}

Overview
${session.fullDescription}

Key information
Subject: ${session.subject}
Format: ${session.mode}
Level: ${session.level}
Date: ${new Date(session.date).toLocaleString()}
Price: ${session.price === 0 ? 'Free' : `$${session.price}`}
Rating: ${session.ratingAverage.toFixed(1)} (${session.ratingCount} reviews)
Seats: ${session.seatsReserved}/${session.seatsTotal}
`,
    });
    showToast('Session recap downloaded.', 'success');
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
        <div className="h-72 rounded-2xl bg-cover bg-center border border-black/5 dark:border-white/10" style={{ backgroundImage: `url(${imageUrl})` }} />

        <h1 className="font-display text-3xl font-semibold mt-8">{session.title}</h1>
        <p className="text-ink/60 dark:text-white/50 mt-1">
          Hosted by {hostName} / Rating {session.ratingAverage.toFixed(1)} ({session.ratingCount} reviews) / {session.mode}
        </p>

        <div className="flex gap-6 mt-6 border-b border-black/10 dark:border-white/10 text-sm font-semibold overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`pb-3 border-b-2 whitespace-nowrap ${tab === item.key ? 'border-primary' : 'border-transparent text-ink/50 dark:text-white/40'}`}
            >
              {item.label}
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
            {(reviews as { _id: string; author: { name: string }; rating: number; comment: string }[]).map((review) => (
              <div key={review._id} className="border-b border-black/5 dark:border-white/10 pb-4">
                <p className="font-semibold">Rating {review.rating}/5 by {review.author.name}</p>
                <p className="text-ink/60 dark:text-white/50 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'related' && (
          <div className="py-6 grid sm:grid-cols-2 gap-4">
            {related.length === 0 && <p className="text-ink/40 dark:text-white/40">No related sessions are available yet.</p>}
            {related.map((item) => <SessionCard key={item._id} session={item} />)}
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
          {session.seatsReserved >= session.seatsTotal ? 'Session full' : reserving ? 'Reserving...' : 'Reserve a seat'}
        </button>
        <button
          onClick={() => bookmark.mutate(session._id, {
            onSuccess: (data) => showToast(data.bookmarked ? 'Session bookmarked.' : 'Bookmark removed.', 'success'),
            onError: (error) => showToast((error as Error).message, 'error'),
          })}
          className="w-full mt-3 py-3 rounded-xl border border-primary text-primary dark:text-primary-light font-semibold"
        >
          Bookmark session
        </button>
        <button
          onClick={downloadRecap}
          className="w-full mt-3 py-3 rounded-xl border border-black/10 dark:border-white/15 font-semibold"
        >
          Download recap DOCX
        </button>
        {error && <p className="text-xs text-coral mt-3">{error}</p>}
        <p className="text-xs text-center text-ink/40 dark:text-white/40 mt-2">
          {session.seatsTotal - session.seatsReserved} seats left
        </p>
      </aside>
    </div>
  );
}
