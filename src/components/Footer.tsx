import Link from 'next/link';
import { StudyCoMark } from './StudyCoLogo';

export function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 pt-14 pb-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <StudyCoMark />
            <span className="font-display font-semibold text-lg">StudyCo</span>
          </div>
          <p className="text-sm text-ink/50 dark:text-white/40 mt-3 max-w-xs">
            Peer study sessions and AI study tools, in one place.
          </p>
          <div className="text-sm text-ink/50 dark:text-white/40 mt-4 space-y-1">
            <p>Dhaka, Bangladesh</p>
            <a href="mailto:support@studyco.app" className="block hover:text-primary dark:hover:text-primary-light">support@studyco.app</a>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase text-ink/40 dark:text-white/40 mb-3">Product</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/explore">Explore sessions</Link>
            <Link href="/ai/generator">Notes generator</Link>
            <Link href="/ai/recommendations">Recommendations</Link>
            <Link href="/ai/assistant">Assistant</Link>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase text-ink/40 dark:text-white/40 mb-3">Company</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase text-ink/40 dark:text-white/40 mb-3">Legal</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="https://github.com/fahid2002/StudyCo-Client" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-black/5 dark:border-white/5 text-xs text-ink/40 dark:text-white/40">
        Copyright {new Date().getFullYear()} StudyCo. All rights reserved.
      </div>
    </footer>
  );
}
