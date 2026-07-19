'use client';

import { useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSavedNotes } from '@/hooks/useStudyTools';
import { cleanAiText } from '@/lib/document-utils';

function makeCards(content: string) {
  return cleanAiText(content)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 45)
    .slice(0, 16)
    .map((line, index) => {
      const [front, ...rest] = line.split(':');
      return { front: rest.length ? front : `Card ${index + 1}`, back: rest.length ? rest.join(':').trim() : line };
    });
}

function FlashcardsContent() {
  const { data: notes } = useSavedNotes();
  const [noteId, setNoteId] = useState('');
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const note = notes?.find((item) => item._id === noteId) ?? notes?.[0];
  const cards = useMemo(() => makeCards(note?.content ?? ''), [note]);
  const card = cards[index] ?? null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-semibold">Flashcard practice</h1>
      <select value={note?._id ?? ''} onChange={(e) => { setNoteId(e.target.value); setIndex(0); setShowBack(false); }} className="mt-6 w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] px-4 py-2.5 text-sm">
        {(notes ?? []).map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
      </select>
      <div className="mt-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-8 min-h-[280px] flex flex-col justify-between">
        {card ? (
          <>
            <div>
              <p className="font-mono text-xs uppercase text-coral">Card {index + 1} of {cards.length}</p>
              <h2 className="font-display text-2xl font-semibold mt-3">{card.front}</h2>
              {showBack && <p className="mt-5 text-sm leading-relaxed text-ink/70 dark:text-white/60">{card.back}</p>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setShowBack((v) => !v)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-paper">{showBack ? 'Hide answer' : 'Show answer'}</button>
              <button onClick={() => { setIndex((index + 1) % cards.length); setShowBack(false); }} className="rounded-xl border border-black/10 dark:border-white/15 px-4 py-2 text-sm font-semibold">Next card</button>
            </div>
          </>
        ) : <p className="text-sm text-ink/50 dark:text-white/40">Save a generated note first to create flashcards.</p>}
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return <ProtectedRoute><FlashcardsContent /></ProtectedRoute>;
}
