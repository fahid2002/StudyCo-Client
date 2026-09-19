import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Profile | StudyCo', description: 'Update your StudyCo name and profile photo.' };

export default function ProfileLayout({ children }: { children: React.ReactNode }) { return children; }
