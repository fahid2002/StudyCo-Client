import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Study Timetable | StudyCo', description: 'Plan your study tasks and deadlines with the StudyCo timetable.' };

export default function TimetableLayout({ children }: { children: React.ReactNode }) { return children; }
