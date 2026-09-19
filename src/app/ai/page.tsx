'use client';

import Link from 'next/link';
import { Bot, FileText, Sparkles, WandSparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const tools = [
  { href: '/ai/assistant', title: 'AI Assistant', description: 'Ask contextual questions about StudyCo, your sessions, and study planning.', Icon: Bot },
  { href: '/ai/generator', title: 'AI Notes Generator', description: 'Create notes, summaries, flashcards, and practice quizzes from a topic.', Icon: WandSparkles },
  { href: '/ai/document', title: 'AI Document Intelligence', description: 'Upload PDF, DOCX, or TXT study material for an actionable AI analysis.', Icon: FileText },
  { href: '/ai/recommendations', title: 'Smart Recommendations', description: 'Find sessions matched to your interests and feedback history.', Icon: Sparkles },
];

export default function AiToolsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-coral">StudyCo intelligence</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">AI tools for the way you study</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/65 dark:text-white/55">
          Choose a tool to generate, understand, organize, and discover more from your study work.
          {!user && ' You\'ll be asked to sign in before using an AI feature.'}
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {tools.map(({ href, title, description, Icon }) => (
          <Link key={href} href={href} className="group rounded-3xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:border-primary dark:border-white/10 dark:bg-[#1B1F29] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-primary-light"><Icon className="h-6 w-6" /></div>
            <h2 className="mt-6 font-display text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-white/50">{description}</p>
            <span className="mt-6 inline-block text-sm font-semibold text-primary dark:text-primary-light group-hover:underline">Open tool →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
