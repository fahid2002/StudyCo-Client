'use client';

import Link from 'next/link';
import { Bot, FileText, History, LayoutDashboard, NotebookPen, PlusCircle, Trash2, WandSparkles } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { useActivityHistory, useClearActivity, useDeleteActivity } from '@/hooks/useActivity';

const tools = [
  { href: '/items/add', label: 'Add Session', detail: 'Publish a new study session.', Icon: PlusCircle },
  { href: '/items/manage', label: 'My Sessions', detail: 'View and delete sessions you host.', Icon: LayoutDashboard },
  { href: '/ai/assistant', label: 'AI Assistant', detail: 'Ask contextual study and app questions.', Icon: Bot },
  { href: '/ai/generator', label: 'AI Notes Generator', detail: 'Create notes, flashcards, summaries, and quizzes.', Icon: WandSparkles },
  { href: '/ai/document', label: 'AI Document', detail: 'Analyze PDFs, DOCX files, and TXT notes.', Icon: FileText },
];

function DashboardContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: activities, isLoading } = useActivityHistory();
  const deleteActivity = useDeleteActivity();
  const clearActivity = useClearActivity();

  function deleteOne(id: string) {
    deleteActivity.mutate(id, {
      onSuccess: () => showToast('History item deleted.', 'success'),
      onError: (error) => showToast((error as Error).message, 'error'),
    });
  }

  function clearAll() {
    clearActivity.mutate(undefined, {
      onSuccess: () => showToast('Activity history cleared.', 'success'),
      onError: (error) => showToast((error as Error).message, 'error'),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral">Dashboard</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">
            Welcome back, {user?.name.split(' ')[0] ?? 'student'}
          </h1>
          <p className="text-sm text-ink/60 dark:text-white/50 mt-2">
            Manage your sessions, open AI study tools, and review your recent activity.
          </p>
        </div>
        <Link href="/explore" className="w-fit rounded-xl bg-amber px-4 py-2.5 text-sm font-semibold text-ink">
          Explore sessions
        </Link>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {tools.map(({ href, label, detail, Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5 hover:border-primary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary-light">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="font-display text-lg font-semibold mt-4">{label}</h2>
            <p className="text-sm text-ink/60 dark:text-white/50 mt-1">{detail}</p>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29]">
        <div className="flex flex-col gap-3 border-b border-black/5 dark:border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/20 text-amber-light">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Activity history</h2>
              <p className="text-sm text-ink/50 dark:text-white/40">Stored in MongoDB for your account.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearAll}
            disabled={!activities?.length || clearActivity.isPending}
            className="w-fit rounded-xl border border-coral px-4 py-2 text-sm font-semibold text-coral disabled:opacity-50"
          >
            Clear all
          </button>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/10">
          {isLoading && <p className="p-5 text-sm text-ink/50 dark:text-white/40">Loading history...</p>}
          {!isLoading && activities?.length === 0 && (
            <p className="p-5 text-sm text-ink/50 dark:text-white/40">No activity has been recorded yet.</p>
          )}
          {activities?.map((activity) => (
            <div key={activity._id} className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{activity.title}</p>
                {activity.detail && <p className="text-sm text-ink/60 dark:text-white/50 mt-1">{activity.detail}</p>}
                <p className="font-mono text-xs uppercase text-ink/40 dark:text-white/40 mt-2">
                  {activity.type} / {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteOne(activity._id)}
                className="rounded-lg p-2 text-coral hover:bg-coral/10"
                aria-label="Delete history item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
