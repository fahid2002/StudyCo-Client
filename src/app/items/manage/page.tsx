'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useMySessions } from '@/hooks/useSessions';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useToast } from '@/lib/toast-context';

function ManageContent() {
  const { data, isLoading } = useMySessions();
  const qc = useQueryClient();
  const { showToast } = useToast();

  async function handleDelete(id: string) {
    try {
      await api.delete(`/sessions/${id}`);
      qc.invalidateQueries({ queryKey: ['my-sessions'] });
      showToast('Session deleted successfully.', 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-semibold">Manage your sessions</h1>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-ink/40 dark:text-white/40 font-mono text-xs uppercase">
            <tr><th className="py-2">Title</th><th>Date</th><th>Status</th><th>Seats</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="py-6 text-ink/40 dark:text-white/40">Loading...</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={5} className="py-6 text-ink/40 dark:text-white/40">You haven&apos;t hosted any sessions yet.</td></tr>}
            {data?.map((s) => (
              <tr key={s._id} className="border-t border-black/5 dark:border-white/10">
                <td className="py-3 font-medium">{s.title}</td>
                <td className="text-ink/60 dark:text-white/50">{new Date(s.date).toLocaleString()}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-mono ${s.status === 'Upcoming' ? 'bg-primary/10 text-primary dark:text-primary-light' : 'bg-black/5 dark:bg-white/10 text-ink/50 dark:text-white/40'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="text-ink/60 dark:text-white/50">{s.seatsReserved}/{s.seatsTotal}</td>
                <td className="flex gap-2 py-3">
                  <Link href={`/session/${s._id}`} className="text-primary dark:text-primary-light font-semibold text-xs">View</Link>
                  <button onClick={() => handleDelete(s._id)} className="text-coral font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ManageSessionsPage() {
  return (
    <ProtectedRoute>
      <ManageContent />
    </ProtectedRoute>
  );
}

