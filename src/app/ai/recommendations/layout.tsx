import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Smart Recommendations | StudyCo', description: 'Discover StudyCo sessions matched to your interests and feedback.' };

export default function RecommendationsLayout({ children }: { children: React.ReactNode }) { return children; }
