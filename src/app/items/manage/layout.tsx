import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Hosted Sessions | StudyCo', description: 'Manage the study sessions you host on StudyCo.' };

export default function ManageSessionsLayout({ children }: { children: React.ReactNode }) { return children; }
