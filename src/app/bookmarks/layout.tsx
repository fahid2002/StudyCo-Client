import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Bookmarks | StudyCo', description: 'View the StudyCo sessions you saved for later.' };

export default function BookmarksLayout({ children }: { children: React.ReactNode }) { return children; }
