import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { StudyCoMark } from '@/components/StudyCoLogo';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-paper dark:bg-[#12151C]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-4">404 / page not found</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
            This study route is not on the board.
          </h1>
          <p className="mt-5 text-ink/60 dark:text-white/50">
            The page may have moved, or the link may be incomplete. You can return home or search the live session catalog.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="px-5 py-3 rounded-xl bg-primary text-paper font-semibold text-sm inline-flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
            <Link href="/explore" className="px-5 py-3 rounded-xl border border-primary text-primary dark:text-primary-light font-semibold text-sm inline-flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Explore sessions
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-8">
          <div className="flex items-center gap-4">
            <StudyCoMark className="h-16 w-16" />
            <div>
              <p className="font-mono text-xs text-ink/40 dark:text-white/40">STUDYCO</p>
              <p className="font-display text-2xl font-semibold">Find your study circle faster.</p>
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
            {['Sessions', 'AI Assistant', 'Notes Generator'].map((item) => (
              <div key={item} className="rounded-xl bg-paperdim dark:bg-[#12151C] p-4 font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
