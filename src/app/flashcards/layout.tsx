import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Flashcards | StudyCo', description: 'Practice with flashcards generated from your StudyCo notes.' };

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) { return children; }
