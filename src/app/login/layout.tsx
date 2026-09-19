import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Log in to StudyCo', description: 'Sign in to manage your StudyCo sessions, bookings, and study tools.' };

export default function LoginLayout({ children }: { children: React.ReactNode }) { return children; }
