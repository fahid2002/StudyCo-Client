'use client';

import Link from 'next/link';
import { useSessions } from '@/hooks/useSessions';
import { SessionCard, SessionCardSkeleton } from '@/components/SessionCard';

const FAQS = [
  ['Is it free to join?', 'Creating an account and browsing sessions is free. Individual sessions may be free or paid, set by the host.'],
  ['How are hosts vetted?', "Hosts build a rating from reviews after each session. New hosts are capped at smaller group sizes until they've run a few."],
  ['Can I host in-person sessions?', 'Yes — set the format to in-person when publishing and add a general area.'],
  ['How does the AI assistant work?', 'It has context on the app and, once logged in, your upcoming sessions — so it can answer things like "when is my next session" directly.'],
];

export default function HomePage() {
  const { data, isLoading } = useSessions({ sort: 'rating', limit: 4, page: 1 });

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center py-14 grid lg:grid-cols-2 gap-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-4">Peer study sessions · AI-guided</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            Find your study circle, <span className="marker text-primary dark:text-primary-light">faster.</span>
          </h1>
          <p className="mt-5 text-lg text-ink/70 dark:text-white/60 max-w-lg">
            Book live study sessions with peers and tutors, generate notes with AI, and get recommendations
            tuned to what you&apos;re actually working on.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/explore" className="px-5 py-3 rounded-xl bg-amber text-ink font-semibold text-sm">
              Explore sessions
            </Link>
            <Link href="/register" className="px-5 py-3 rounded-xl border border-primary text-primary dark:text-primary-light font-semibold text-sm">
              Create free account
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-primary dark:bg-primary-dark text-paper p-6 shadow-xl">
          <p className="font-mono text-[11px] opacity-70">FEATURED</p>
          <h3 className="font-display text-xl mt-1">Linear Algebra Study Circle</h3>
          <p className="text-sm opacity-80 mt-2">6 seats, small-group format</p>
        </div>
      </section>

      <section className="py-20 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <h2 className="font-display text-3xl font-semibold">Featured this week</h2>
            <Link href="/explore" className="text-sm font-semibold text-primary dark:text-primary-light">
              Explore all sessions →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SessionCardSkeleton key={i} />)
              : data?.data.map((s) => <SessionCard key={s._id} session={s} />)}
          </div>
        </div>
      </section>

      <section className="py-20 bg-paperdim dark:bg-[#181C25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold mb-8">Three AI features built around real studying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 bg-white dark:bg-[#1B1F29] border border-black/5 dark:border-white/10">
              <h3 className="font-display text-lg font-semibold">AI Notes &amp; Flashcard Generator</h3>
              <p className="text-sm text-ink/60 dark:text-white/50 mt-2">Turn any topic into notes, summaries, flashcards, or a quiz.</p>
              <Link href="/ai/generator" className="text-sm font-semibold text-primary dark:text-primary-light mt-4 inline-block">Try it →</Link>
            </div>
            <div className="rounded-2xl p-6 bg-white dark:bg-[#1B1F29] border border-black/5 dark:border-white/10">
              <h3 className="font-display text-lg font-semibold">Smart Session Recommendations</h3>
              <p className="text-sm text-ink/60 dark:text-white/50 mt-2">Recommendations that adjust to your subjects and feedback.</p>
              <Link href="/ai/recommendations" className="text-sm font-semibold text-primary dark:text-primary-light mt-4 inline-block">See recommendations →</Link>
            </div>
            <div className="rounded-2xl p-6 bg-white dark:bg-[#1B1F29] border border-black/5 dark:border-white/10">
              <h3 className="font-display text-lg font-semibold">AI Study Assistant</h3>
              <p className="text-sm text-ink/60 dark:text-white/50 mt-2">A chat assistant that knows your bookings and the app itself.</p>
              <span className="text-sm font-semibold text-primary dark:text-primary-light mt-4 inline-block">Open the chat bubble →</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary dark:bg-primary-dark text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><p className="font-display text-4xl font-bold">12,400+</p><p className="text-sm opacity-70 mt-1 font-mono">sessions hosted</p></div>
          <div><p className="font-display text-4xl font-bold">38,000+</p><p className="text-sm opacity-70 mt-1 font-mono">students</p></div>
          <div><p className="font-display text-4xl font-bold">6</p><p className="text-sm opacity-70 mt-1 font-mono">subject areas</p></div>
          <div><p className="font-display text-4xl font-bold">4.8</p><p className="text-sm opacity-70 mt-1 font-mono">avg host rating</p></div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold mb-8">Frequently asked</h2>
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5">
                <summary className="font-medium cursor-pointer">{q}</summary>
                <p className="text-sm text-ink/60 dark:text-white/50 mt-2">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl bg-ink dark:bg-[#1B1F29] text-paper p-12 text-center">
          <h2 className="font-display text-3xl font-semibold">Your next study session is one search away.</h2>
          <Link href="/explore" className="mt-6 inline-block px-6 py-3 rounded-full bg-amber text-ink font-semibold">
            Explore sessions
          </Link>
        </div>
      </section>
    </div>
  );
}
