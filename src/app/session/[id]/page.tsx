'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSession, useSubmitReview } from '@/hooks/useSessions';
import { SessionCard } from '@/components/SessionCard';
import { api } from '@/lib/axios';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { downloadDocx } from '@/lib/document-utils';
import { useToggleBookmark } from '@/hooks/useStudyTools';
import { buildLoginUrl } from '@/lib/redirect';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type Tab = 'overview' | 'specs' | 'reviews' | 'related';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80';

export default function SessionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading, refetch } = useSession(id, !!user && !authLoading);
  const { showToast } = useToast();
  const bookmark = useToggleBookmark();
  const submitReview = useSubmitReview();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('overview');
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(buildLoginUrl(`${window.location.pathname}${window.location.search}`));
    }
  }, [authLoading, router, user]);

  if (authLoading || !user) return <div className="max-w-6xl mx-auto px-4 py-20 flex justify-center"><LoadingSpinner label="Checking your account..." /></div>;
  if (isLoading) return <div className="max-w-6xl mx-auto px-4 py-20 flex justify-center"><LoadingSpinner label="Loading session..." /></div>;
  if (!data) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-ink/40">Session not found.</div>;

  const { session, reviews, related } = data;
  const hostName = typeof session.host === 'string' ? 'Host' : session.host.name;
  const imageUrl = session.imageUrl || FALLBACK_IMAGE;
  const canReview = Boolean(session.attendees?.some((attendee) => String(attendee) === String(user.id)));

  async function reserve() {
    if (!user) {
      window.location.href = buildLoginUrl(`${window.location.pathname}${window.location.search}`);
      return;
    }
    setReserving(true);
    setError('');
    try {
      await api.post(`/sessions/${id}/reserve`);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['booked-sessions'] });
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

  function submitReviewForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reviewRating || !reviewComment.trim()) {
      showToast('Choose a rating and write a comment first.', 'error');
      return;
    }

    submitReview.mutate(
      { sessionId: session._id, rating: reviewRating, comment: reviewComment.trim() },
      {
        onSuccess: async () => {
          await refetch();
          setReviewRating(0);
          setReviewComment('');
          showToast('Review submitted successfully!', 'success');
        },
        onError: (requestError) => showToast((requestError as Error).message, 'error'),
      }
    );
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
            {user && canReview && (
              <form onSubmit={submitReviewForm} className="rounded-2xl border border-primary/20 bg-primary/5 p-5 dark:bg-primary/10">
                <p className="font-display text-xl font-semibold">Share your experience</p>
                <p className="mt-1 text-sm text-ink/60 dark:text-white/50">You can review this session after reserving a seat.</p>
                <div className="mt-4 flex items-center gap-2" aria-label="Choose a rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewRating(value)}
                      className={`text-2xl ${value <= reviewRating ? 'text-amber' : 'text-ink/20 dark:text-white/20'}`}
                      aria-label={`Rate ${value} out of 5`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs text-ink/50 dark:text-white/40">{reviewRating ? `${reviewRating}/5` : 'Select rating'}</span>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="What did you think about this session?"
                  className="mt-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-white/15 dark:bg-[#12151C]"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-ink/40 dark:text-white/40">{reviewComment.length}/1000</span>
                  <button type="submit" disabled={submitReview.isPending} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-50">
                    {submitReview.isPending ? 'Submitting...' : 'Submit review'}
                  </button>
                </div>
              </form>
            )}
            {user && !canReview && (
              <p className="rounded-xl bg-paperdim p-4 text-sm text-ink/60 dark:bg-[#12151C] dark:text-white/50">
                Reserve a seat in this session to submit a review.
              </p>
            )}
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
