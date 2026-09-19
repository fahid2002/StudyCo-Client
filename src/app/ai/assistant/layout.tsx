import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'AI Study Assistant | StudyCo', description: 'Ask StudyCo questions about sessions, study planning, and your account.' };

export default function AssistantLayout({ children }: { children: React.ReactNode }) { return children; }
