'use client';

import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useDeleteNote, useSavedNotes } from '@/hooks/useStudyTools';
import { cleanAiText } from '@/lib/document-utils';
import { useToast } from '@/lib/toast-context';

function NotesContent() {
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('');
  const [openId, setOpenId] = useState('');
  const { data: notes, isLoading } = useSavedNotes({ search, folder });
  const deleteNote = useDeleteNote();
  const { showToast } = useToast();
  const folders = useMemo(() => Array.from(new Set((notes ?? []).map((note) => note.folder))).sort(), [notes]);
  const openNote = notes?.find((note) => note._id === openId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold">Saved notes library</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] px-4 py-2.5 text-sm" />
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] px-4 py-2.5 text-sm">
          <option value="">All folders</option>
          {folders.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="mt-6 grid lg:grid-cols-[360px_1fr] gap-5">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] divide-y divide-black/5 dark:divide-white/10">
          {isLoading && <p className="p-5 text-sm text-ink/50 dark:text-white/40">Loading notes...</p>}
          {notes?.length === 0 && <p className="p-5 text-sm text-ink/50 dark:text-white/40">No saved notes yet.</p>}
          {notes?.map((note) => (
            <div key={note._id} className="flex items-start justify-between gap-3 p-4">
              <button onClick={() => setOpenId(note._id)} className="text-left">
                <p className="font-semibold">{note.title}</p>
                <p className="text-xs font-mono text-ink/40 dark:text-white/40 mt-1">{note.folder} / {new Date(note.createdAt).toLocaleDateString()}</p>
              </button>
              <button
                onClick={() => deleteNote.mutate(note._id, { onSuccess: () => showToast('Saved note deleted.', 'success') })}
                className="p-2 text-coral"
                aria-label="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-6">
          {openNote ? (
            <>
              <p className="font-mono text-xs uppercase text-coral">{openNote.folder}</p>
              <h2 className="font-display text-2xl font-semibold mt-1">{openNote.title}</h2>
              <div className="studyco-scroll mt-5 max-h-[65vh] overflow-y-auto pr-3 whitespace-pre-line text-sm leading-relaxed text-ink/80 dark:text-white/70">{cleanAiText(openNote.content)}</div>
            </>
          ) : (
            <p className="text-sm text-ink/50 dark:text-white/40">Select a note to read it.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return <ProtectedRoute><NotesContent /></ProtectedRoute>;
}
