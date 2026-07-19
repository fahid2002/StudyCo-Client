'use client';

import { useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCreateQuizScore, useQuizScores, useSavedNotes } from '@/hooks/useStudyTools';
import { cleanAiText } from '@/lib/document-utils';
import { useToast } from '@/lib/toast-context';

function makeQuestions(content: string) {
  return cleanAiText(content)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 50)
    .slice(0, 5)
    .map((line, index) => ({ question: `What is the key idea in item ${index + 1}?`, answer: line }));
}

function QuizContent() {
  const { data: notes } = useSavedNotes();
  const { data: scores } = useQuizScores();
  const saveScore = useCreateQuizScore();
  const { showToast } = useToast();
  const [noteId, setNoteId] = useState('');
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [known, setKnown] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const note = notes?.find((item) => item._id === noteId) ?? notes?.[0];
  const questions = useMemo(() => makeQuestions(note?.content ?? ''), [note]);

  function markKnown(index: number) {
    if (known[index]) return;
    setKnown((value) => ({ ...value, [index]: true }));
    setScore((value) => Math.min(questions.length, value + 1));
    showToast(`Marked question ${index + 1} as known.`, 'success');
  }

  function finish() {
    saveScore.mutate({ topic: note?.title ?? 'Practice quiz', score, total: questions.length }, {
      onSuccess: () => showToast('Quiz score saved.', 'success'),
      onError: (error) => showToast((error as Error).message, 'error'),
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-semibold">Quiz practice</h1>
      <select value={note?._id ?? ''} onChange={(e) => { setNoteId(e.target.value); setRevealed({}); setKnown({}); setScore(0); }} className="mt-6 w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] px-4 py-2.5 text-sm">
        {(notes ?? []).map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
      </select>
      <div className="mt-6 space-y-4">
        {(notes ?? []).length === 0 && (
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5 text-sm text-ink/60 dark:text-white/50">
            Save a generated note first, then come back here to practice a quiz.
          </div>
        )}
        {questions.map((item, index) => (
          <div key={index} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5">
            <p className="font-semibold">{item.question}</p>
            {revealed[index] && <p className="mt-3 text-sm text-ink/70 dark:text-white/60">{item.answer}</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => setRevealed((v) => ({ ...v, [index]: true }))} className="rounded-lg border border-black/10 dark:border-white/15 px-3 py-1.5 text-xs font-semibold">Show answer</button>
              <button
                onClick={() => markKnown(index)}
                disabled={known[index]}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-paper disabled:opacity-60"
              >
                {known[index] ? 'Marked known' : 'I knew this'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {questions.length > 0 && <button onClick={finish} className="mt-6 rounded-xl bg-amber px-5 py-2.5 text-sm font-semibold text-ink">Save score: {score}/{questions.length}</button>}
      <div className="mt-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5">
        <h2 className="font-display text-xl font-semibold">Score history</h2>
        <div className="mt-3 space-y-2 text-sm">
          {(scores ?? []).map((item) => <p key={item._id}>{item.topic}: {item.score}/{item.total} / {new Date(item.createdAt).toLocaleDateString()}</p>)}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return <ProtectedRoute><QuizContent /></ProtectedRoute>;
}
