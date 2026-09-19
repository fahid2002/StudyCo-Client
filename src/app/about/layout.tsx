import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About StudyCo', description: 'Learn how StudyCo helps students find peer study sessions and AI-powered study tools.' };

export default function AboutLayout({ children }: { children: React.ReactNode }) { return children; }
