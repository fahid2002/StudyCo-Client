import Link from 'next/link';
import { StudySession } from '@/types';

const FALLBACK_IMAGES: Record<string, string> = {
  Mathematics: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
  'Computer Science': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
  Languages: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
  Sciences: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=900&q=80',
  Business: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  'Test Prep': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80',
};

export function SessionCard({ session }: { session: StudySession }) {
  const hostName = typeof session.host === 'string' ? 'Host' : session.host.name;
  const imageUrl = session.imageUrl || FALLBACK_IMAGES[session.subject] || FALLBACK_IMAGES.Mathematics;

  return (
    <div className="h-full rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] flex flex-col">
      <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
      <div className="p-4 flex flex-col flex-1">
        <p className="font-mono text-[11px] text-ink/40 dark:text-white/40">{session.subject} / {session.mode}</p>
        <h3 className="font-display font-semibold mt-1 leading-snug">{session.title}</h3>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-2 line-clamp-2">{session.shortDescription}</p>
        <p className="text-xs text-ink/50 dark:text-white/40 mt-2">Hosted by {hostName}</p>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="font-semibold">{session.price === 0 ? 'Free' : `$${session.price}`}</span>
          <span className="font-mono text-xs">Rating {session.ratingAverage.toFixed(1)} ({session.ratingCount})</span>
        </div>
        <p className="text-xs text-ink/40 dark:text-white/40 mt-1">{new Date(session.date).toLocaleString()}</p>
        <Link
          href={`/session/${session._id}`}
          className="mt-auto text-center text-sm font-semibold py-2 rounded-lg border border-primary text-primary dark:text-primary-light dark:border-primary-light"
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
      <div className="h-36 bg-black/10 dark:bg-white/10" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-4 w-3/4 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-10 w-full bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-8 w-full bg-black/10 dark:bg-white/10 rounded-lg mt-3" />
      </div>
    </div>
  );
}
