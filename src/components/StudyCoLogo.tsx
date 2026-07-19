import Link from 'next/link';

export function StudyCoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <span className={`${className} rounded-lg bg-primary dark:bg-primary-light flex items-center justify-center shadow-sm`}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
        <rect width="64" height="64" rx="14" fill="currentColor" className="text-primary dark:text-primary-light" />
        <path d="M18 17h15c7 0 12 4 12 10 0 4-2 7-6 9 5 2 8 5 8 10 0 7-6 11-14 11H18V17Zm9 8v8h6c3 0 5-1 5-4s-2-4-5-4h-6Zm0 16v8h7c4 0 6-1 6-4s-2-4-6-4h-7Z" fill="#F7F5EF" />
        <path d="M14 14c6-3 13-3 19 0v6c-6-3-13-3-19 0v-6Zm17 0c6-3 13-3 19 0v6c-6-3-13-3-19 0v-6Z" fill="#E8A33D" />
        <path d="M16 48c5-2 11-2 16 0 5-2 11-2 16 0v5c-5-2-11-2-16 0-5-2-11-2-16 0v-5Z" fill="#D65A55" />
      </svg>
    </span>
  );
}

export function StudyCoLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <StudyCoMark />
      <span className="font-display font-semibold text-lg tracking-tight">StudyCo</span>
    </Link>
  );
}
