'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StudySession } from '@/types';

export function SessionStatsChart({ sessions }: { sessions: StudySession[] }) {
  const data = sessions.reduce<Record<string, { subject: string; sessions: number; seats: number }>>((acc, session) => {
    const current = acc[session.subject] ?? { subject: session.subject, sessions: 0, seats: 0 };
    current.sessions += 1;
    current.seats += Math.max(0, session.seatsTotal - session.seatsReserved);
    acc[session.subject] = current;
    return acc;
  }, {});

  const chartData = Object.values(data);

  if (chartData.length === 0) {
    return <p className="text-sm text-ink/50 dark:text-white/40">Session data will appear after the catalog loads.</p>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="subject" tick={{ fontSize: 11 }} interval={0} height={54} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="sessions" fill="#2B4C7E" radius={[6, 6, 0, 0]} />
          <Bar dataKey="seats" fill="#E8A33D" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
