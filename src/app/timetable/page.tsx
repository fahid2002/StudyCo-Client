'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCreateTimetableItem, useDeleteTimetableItem, useTimetable } from '@/hooks/useStudyTools';
import { useToast } from '@/lib/toast-context';

function TimetableContent() {
  const { data } = useTimetable();
  const createItem = useCreateTimetableItem();
  const deleteItem = useDeleteTimetableItem();
  const { showToast } = useToast();
  const [form, setForm] = useState({ title: '', subject: '', startAt: '', notes: '' });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    createItem.mutate(form, {
      onSuccess: () => { showToast('Study plan added.', 'success'); setForm({ title: '', subject: '', startAt: '', notes: '' }); },
      onError: (error) => showToast((error as Error).message, 'error'),
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-semibold">Study timetable</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5 md:grid-cols-2">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" className="rounded-xl bg-paperdim dark:bg-[#12151C] px-4 py-2.5 text-sm" />
        <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="rounded-xl bg-paperdim dark:bg-[#12151C] px-4 py-2.5 text-sm" />
        <input required type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} className="rounded-xl bg-paperdim dark:bg-[#12151C] px-4 py-2.5 text-sm" />
        <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" className="rounded-xl bg-paperdim dark:bg-[#12151C] px-4 py-2.5 text-sm" />
        <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-paper md:col-span-2">Add to timetable</button>
      </form>
      <div className="mt-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] divide-y divide-black/5 dark:divide-white/10">
        {data?.length === 0 && <p className="p-5 text-sm text-ink/50 dark:text-white/40">No study plans yet.</p>}
        {data?.map((item) => (
          <div key={item._id} className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-ink/60 dark:text-white/50">{item.subject} / {new Date(item.startAt).toLocaleString()}</p>
              {item.notes && <p className="text-sm text-ink/50 dark:text-white/40 mt-1">{item.notes}</p>}
            </div>
            <button onClick={() => deleteItem.mutate(item._id, { onSuccess: () => showToast('Study plan deleted.', 'success') })} className="p-2 text-coral"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimetablePage() {
  return <ProtectedRoute><TimetableContent /></ProtectedRoute>;
}
