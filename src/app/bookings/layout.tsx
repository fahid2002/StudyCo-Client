import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Bookings | StudyCo', description: 'Review, update, and cancel your reserved StudyCo sessions.' };

export default function BookingsLayout({ children }: { children: React.ReactNode }) { return children; }
