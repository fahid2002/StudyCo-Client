import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard | StudyCo', description: 'Manage your StudyCo sessions, bookings, tools, and activity.' };

export default function DashboardLayout({ children }: { children: React.ReactNode }) { return children; }
