'use client';

import Link from 'next/link';
import { ArrowRight, Bot, CalendarCheck, FileText, Search, Sparkles, Users } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { SessionCard, SessionCardSkeleton } from '@/components/SessionCard';

const FAQS = [
  ['Is it free to join?', 'Creating an account and browsing sessions is free. Individual sessions may be free or paid, set by the host.'],
  ['How are hosts vetted?', "Hosts build a rating from reviews after each session. New hosts are capped at smaller group sizes until they've run a few."],
  ['Can I host in-person sessions?', 'Yes. Set the format to in-person when publishing and add a general area in the description.'],
  ['How does the AI assistant work?', 'It uses StudyCo navigation context and your account activity to answer follow-up questions about sessions and study planning.'],
];

const SUBJECTS = ['Mathematics', 'Computer Science', 'Languages', 'Sciences', 'Business', 'Test Prep'];

export default function HomePage() {
  const { data, isLoading } = useSessions({ sort: 'rating', limit: 4, page: 1 });

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[65vh] grid lg:grid-cols-2 gap-10 items-center py-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-4">Peer study sessions / AI-guided</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            Find your study circle, <span className="marker text-primary dark:text-primary-light">faster.</span>
          </h1>
          <p className="mt-5 text-lg text-ink/70 dark:text-white/60 max-w-lg">
            Book live study sessions with peers and tutors, generate notes with AI, and get recommendations tuned to what you are working on.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/explore" className="px-5 py-3 rounded-xl bg-amber text-ink font-semibold text-sm inline-flex items-center justify-center gap-2">
              Explore sessions <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="px-5 py-3 rounded-xl border border-primary text-primary dark:text-primary-light font-semibold text-sm text-center">
              Create free account
            </Link>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl bg-primary dark:bg-primary-dark text-paper p-6 shadow-xl">
            <p className="font-mono text-[11px] opacity-70">LIVE SESSION</p>
            <h3 className="font-display text-2xl mt-1">Linear Algebra Study Circle</h3>
            <p className="text-sm opacity-80 mt-2">Small-group problem solving with AI-generated recap notes after the session.</p>
          </div>
          <div className="rounded-2xl bg-amber text-ink p-6 shadow-xl ml-8">
            <p className="font-mono text-[11px] opacity-70">AI ASSISTANT</p>
            <p className="font-display text-xl mt-1">Summarize my Chapter 4 notes into flashcards.</p>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">What StudyCo does</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">Three AI tools built around real studying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              [FileText, 'AI notes generator', 'Create notes, summaries, flashcards, or practice quizzes from a topic and chosen length.', '/ai/generator'],
              [Sparkles, 'Smart recommendations', 'Get session matches that adapt to your interests and feedback over time.', '/ai/recommendations'],
              [Bot, 'Context assistant', 'Ask follow-up questions about the app, your hosted sessions, and study planning.', '/ai/assistant'],
            ].map(([Icon, title, text, href]) => (
              <div key={String(title)} className="rounded-2xl p-6 bg-white dark:bg-[#1B1F29] border border-black/5 dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-primary-light flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{String(title)}</h3>
                <p className="text-sm text-ink/60 dark:text-white/50 mt-2">{String(text)}</p>
                <Link href={String(href)} className="text-sm font-semibold text-primary dark:text-primary-light mt-4 inline-block">Open tool</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-paperdim dark:bg-[#181C25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold mb-10">How a session comes together</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              ['01', 'Search or get matched', 'Search by subject or let recommendations surface sessions.'],
              ['02', 'Check details', 'Review host rating, format, seats, price, and coverage.'],
              ['03', 'Reserve a seat', 'Save your spot from the public details page after login.'],
              ['04', 'Study with support', 'Use the assistant and generator before or after the session.'],
            ].map(([step, title, text]) => (
              <div key={step}>
                <p className="font-mono text-xs text-coral mb-2">{step}</p>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="text-sm text-ink/60 dark:text-white/50 mt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">Explore</p>
              <h2 className="font-display text-3xl font-semibold">Featured this week</h2>
            </div>
            <Link href="/explore" className="text-sm font-semibold text-primary dark:text-primary-light">Explore all sessions</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SessionCardSkeleton key={i} />)
              : data?.data.map((session) => <SessionCard key={session._id} session={session} />)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary dark:bg-primary-dark text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><Users className="h-6 w-6 mx-auto mb-2" /><p className="font-display text-4xl font-bold">12k+</p><p className="text-sm opacity-70 mt-1 font-mono">sessions hosted</p></div>
          <div><CalendarCheck className="h-6 w-6 mx-auto mb-2" /><p className="font-display text-4xl font-bold">38k+</p><p className="text-sm opacity-70 mt-1 font-mono">students</p></div>
          <div><Search className="h-6 w-6 mx-auto mb-2" /><p className="font-display text-4xl font-bold">6</p><p className="text-sm opacity-70 mt-1 font-mono">subject areas</p></div>
          <div><Sparkles className="h-6 w-6 mx-auto mb-2" /><p className="font-display text-4xl font-bold">4.8</p><p className="text-sm opacity-70 mt-1 font-mono">average rating</p></div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold mb-8">Subjects students are booking</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBJECTS.map((subject) => (
              <Link key={subject} href={`/explore?subject=${encodeURIComponent(subject)}`} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5 font-semibold hover:border-primary">
                {subject}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-paperdim dark:bg-[#181C25]">
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl bg-ink dark:bg-[#1B1F29] text-paper p-10 sm:p-12 text-center">
          <h2 className="font-display text-3xl font-semibold">Your next study session is one search away.</h2>
          <Link href="/explore" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber text-ink font-semibold">
            Explore sessions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
