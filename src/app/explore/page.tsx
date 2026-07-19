'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSessions } from '@/hooks/useSessions';
import { SessionCard, SessionCardSkeleton } from '@/components/SessionCard';
import { useBookmarks } from '@/hooks/useStudyTools';
import { useAuth } from '@/lib/auth-context';

const SUBJECTS = ['Mathematics', 'Computer Science', 'Languages', 'Sciences', 'Business', 'Test Prep'];

function ExploreContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState(searchParams.get('subject') ?? '');
  const [mode, setMode] = useState('');
  const [sort, setSort] = useState<'newest' | 'rating' | 'price'>('newest');
  const [page, setPage] = useState(1);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const { user } = useAuth();

  const { data, isLoading } = useSessions({ search, subject, mode, sort, page, limit: 8 });
  const { data: bookmarks } = useBookmarks(!!user);
  const bookmarkedIds = new Set((bookmarks ?? []).map((item) => item.session._id));
  const sessions = bookmarkedOnly ? data?.data.filter((item) => bookmarkedIds.has(item._id)) : data?.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-6">Explore study sessions</h1>

      <div className="bg-white dark:bg-[#1B1F29] border border-black/5 dark:border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          type="text"
          placeholder="Search sessions, subjects, hosts..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none"
        />
        <select value={subject} onChange={(e) => { setSubject(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm">
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={mode} onChange={(e) => { setMode(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm">
          <option value="">Any format</option>
          <option>Online</option>
          <option>In-person</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="px-3 py-2.5 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm">
          <option value="newest">Sort: Newest</option>
          <option value="rating">Sort: Highest rated</option>
          <option value="price">Sort: Price, low to high</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl bg-paperdim dark:bg-[#12151C] px-3 py-2.5 text-sm">
          <input type="checkbox" checked={bookmarkedOnly} onChange={(e) => setBookmarkedOnly(e.target.checked)} disabled={!user} className="accent-primary" />
          Bookmarked only
        </label>
      </div>

      <p className="text-sm text-ink/50 dark:text-white/40 font-mono mt-4">
        {data ? `${data.meta?.total ?? data.data.length} sessions found` : ''}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4 min-h-[300px]">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SessionCardSkeleton key={i} />)
          : sessions?.length
          ? sessions.map((s) => <SessionCard key={s._id} session={s} />)
          : (
            <div className="col-span-full text-center py-16 text-ink/40 dark:text-white/40">
              No sessions match those filters yet. Try widening your search.
            </div>
          )}
      </div>

      {data?.meta && data.meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: data.meta.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-full text-sm font-semibold ${
                page === i + 1 ? 'bg-primary text-paper' : 'border border-black/10 dark:border-white/15'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-sm text-ink/50 dark:text-white/40">Loading sessions...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
