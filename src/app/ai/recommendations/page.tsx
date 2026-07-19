'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRecommendations, useRecommendationFeedback } from '@/hooks/useRecommendations';
import { SessionCard } from '@/components/SessionCard';
import { useToast } from '@/lib/toast-context';

function RecommendationsContent() {
  const { data, isLoading } = useRecommendations();
  const feedback = useRecommendationFeedback();
  const [feedbackCount, setFeedbackCount] = useState(0);
  const { showToast } = useToast();

  function vote(sessionId: string, v: 'up' | 'down') {
    feedback.mutate(
      { sessionId, vote: v },
      {
        onSuccess: () => showToast('Recommendation feedback saved.', 'success'),
        onError: (error) => showToast((error as Error).message, 'error'),
      }
    );
    setFeedbackCount((c) => c + 1);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-semibold">Recommended for you</h1>
      <p className="text-sm text-ink/60 dark:text-white/50 mt-2">
        Based on your saved interests and how you&apos;ve rated past recommendations.
      </p>

      {isLoading && <p className="text-ink/40 dark:text-white/40 mt-8">Loading recommendations...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {data?.map(({ session, reason }) => (
          <div key={session._id} className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29]">
            <div className="p-4">
              <p className="text-[11px] font-mono text-coral">{reason}</p>
            </div>
            <SessionCard session={session} />
            <div className="flex gap-2 p-4 pt-0">
              <button onClick={() => vote(session._id, 'up')} className="flex-1 py-1.5 rounded-lg border border-black/10 dark:border-white/15 text-xs">Good match</button>
              <button onClick={() => vote(session._id, 'down')} className="flex-1 py-1.5 rounded-lg border border-black/10 dark:border-white/15 text-xs">Not for me</button>
            </div>
          </div>
        ))}
      </div>

      {feedbackCount > 0 && (
        <p className="text-xs font-mono text-ink/40 dark:text-white/40 mt-6 text-center">
          Refining recommendations... {feedbackCount} response{feedbackCount !== 1 ? 's' : ''} recorded this session.
        </p>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <ProtectedRoute>
      <RecommendationsContent />
    </ProtectedRoute>
  );
}

