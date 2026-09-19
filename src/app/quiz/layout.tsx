import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Quiz Practice | StudyCo', description: 'Test your understanding with StudyCo quiz practice.' };

export default function QuizLayout({ children }: { children: React.ReactNode }) { return children; }
