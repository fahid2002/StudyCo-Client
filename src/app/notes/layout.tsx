import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Saved Notes | StudyCo', description: 'Organize and revisit your saved StudyCo notes.' };

export default function NotesLayout({ children }: { children: React.ReactNode }) { return children; }
