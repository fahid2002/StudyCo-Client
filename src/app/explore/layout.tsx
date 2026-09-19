import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Explore Study Sessions', description: 'Search and discover upcoming peer-led StudyCo sessions by subject, format, and level.' };

export default function ExploreLayout({ children }: { children: React.ReactNode }) { return children; }
