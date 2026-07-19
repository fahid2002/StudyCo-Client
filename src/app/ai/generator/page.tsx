'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useGenerateContent } from '@/hooks/useGenerator';
import { useToast } from '@/lib/toast-context';

function GeneratorContent() {
  const [type, setType] = useState<'Study notes' | 'Summary' | 'Flashcards' | 'Practice quiz'>('Study notes');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const generate = useGenerateContent();
  const { showToast } = useToast();

  function runGenerator() {
    if (!topic.trim()) {
      showToast('Enter a study topic first.', 'error');
      return;
    }
    generate.mutate(
      { type, topic, length },
      {
        onSuccess: () => showToast('Study content generated successfully.', 'success'),
        onError: (error) => showToast((error as Error).message, 'error'),
      }
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">AI notes generator</h1>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-2">Give it a topic and it drafts study notes, a summary, or flashcards.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Content type</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm">
              <option>Study notes</option><option>Summary</option><option>Flashcards</option><option>Practice quiz</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium">Length: <span className="font-mono">{length}</span></label>
            <input type="range" min={1} max={3} value={['Short', 'Medium', 'Long'].indexOf(length) + 1}
              onChange={(e) => setLength((['Short', 'Medium', 'Long'] as const)[Number(e.target.value) - 1])}
              className="w-full accent-primary" />
          </div>
          <button
            onClick={runGenerator}
            disabled={generate.isPending}
            className="px-6 py-3 rounded-xl bg-primary text-paper font-semibold disabled:opacity-50"
          >
            {generate.isPending ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-6 min-h-[320px]">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-xs uppercase text-ink/40 dark:text-white/40">Output</p>
          <div className="flex gap-2">
            <button onClick={runGenerator} className="text-xs font-semibold text-primary dark:text-primary-light">Regenerate</button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generate.data?.output ?? '');
                showToast('Generated content copied.', 'success');
              }}
              className="text-xs font-semibold text-primary dark:text-primary-light"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-line text-ink/80 dark:text-white/70">
          {generate.isError && <p className="text-coral text-sm">{(generate.error as Error).message}</p>}
          {generate.data?.output ?? 'Enter a topic and generate study content.'}
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <ProtectedRoute>
      <GeneratorContent />
    </ProtectedRoute>
  );
}
