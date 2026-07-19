'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SessionCard } from '@/components/SessionCard';
import { useBookmarks } from '@/hooks/useStudyTools';

function BookmarksContent() {
  const { data, isLoading } = useBookmarks();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold">Bookmarked sessions</h1>
      {isLoading && <p className="mt-6 text-sm text-ink/50 dark:text-white/40">Loading bookmarks...</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {data?.map((bookmark) => <SessionCard key={bookmark._id} session={bookmark.session} />)}
      </div>
      {data?.length === 0 && <p className="mt-6 text-sm text-ink/50 dark:text-white/40">No bookmarked sessions yet.</p>}
    </div>
  );
}

export default function BookmarksPage() {
  return <ProtectedRoute><BookmarksContent /></ProtectedRoute>;
}
