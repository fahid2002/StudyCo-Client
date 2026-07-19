import Link from 'next/link';
import { StudySession } from '@/types';

const ICONS: Record<string, [string, string]> = {
  Mathematics: ['📐', 'bg-primary'],
  'Computer Science': ['💻', 'bg-coral'],
  Languages: ['🗣️', 'bg-amber'],
  Sciences: ['🧪', 'bg-primary'],
  Business: ['📊', 'bg-coral'],
  'Test Prep': ['📝', 'bg-amber'],
};

export function SessionCard({ session }: { session: StudySession }) {
  const [icon, bg] = ICONS[session.subject] ?? ['📚', 'bg-primary'];
  const hostName = typeof session.host === 'string' ? 'Host' : session.host.name;

  return (
    <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] flex flex-col">
      <div className={`h-32 ${bg} flex items-center justify-center text-4xl`}>{icon}</div>
      <div className="p-4 flex flex-col flex-1">
        <p className="font-mono text-[11px] text-ink/40 dark:text-white/40">{session.subject} · {session.mode}</p>
        <h3 className="font-display font-semibold mt-1 leading-snug">{session.title}</h3>
        <p className="text-xs text-ink/50 dark:text-white/40 mt-1">Hosted by {hostName}</p>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="font-semibold">{session.price === 0 ? 'Free' : `$${session.price}`}</span>
          <span className="font-mono text-xs">★ {session.ratingAverage.toFixed(1)} ({session.ratingCount})</span>
        </div>
        <p className="text-xs text-ink/40 dark:text-white/40 mt-1">{new Date(session.date).toLocaleString()}</p>
        <Link
          href={`/session/${session._id}`}
          className="mt-3 text-center text-sm font-semibold py-2 rounded-lg border border-primary text-primary dark:text-primary-light dark:border-primary-light"
        >
          View details
        </Link>
      </div>
    </div>
  );
}

export function SessionCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 animate-pulse">
      <div className="h-32 bg-black/10 dark:bg-white/10" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-4 w-3/4 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-3 w-1/3 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-8 w-full bg-black/10 dark:bg-white/10 rounded-lg mt-3" />
      </div>
    </div>
  );
}
