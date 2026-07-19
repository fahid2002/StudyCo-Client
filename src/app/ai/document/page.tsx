'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { api } from '@/lib/axios';

function DocumentIntelligenceContent() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/ai/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(res.data.data.analysis);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-semibold">AI document intelligence</h1>
      <p className="text-sm text-ink/60 dark:text-white/50 mt-2">
        Upload lecture notes, a reading, or a PDF and get a summary, key points, and action items.
      </p>

      <form onSubmit={handleUpload} className="mt-8 rounded-2xl border border-dashed border-black/20 dark:border-white/20 p-8 text-center">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <p className="text-xs text-ink/40 dark:text-white/40 mt-2">PDF, DOCX, or TXT — up to 10MB</p>
        <button disabled={!file || loading} className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-paper font-semibold text-sm disabled:opacity-50">
          {loading ? 'Analyzing…' : 'Analyze document'}
        </button>
      </form>

      {error && <p className="text-sm text-coral mt-4">{error}</p>}

      {analysis && (
        <div className="mt-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-6">
          <p className="font-mono text-xs uppercase text-ink/40 dark:text-white/40 mb-3">Analysis</p>
          <div className="text-sm leading-relaxed whitespace-pre-line text-ink/80 dark:text-white/70">{analysis}</div>
        </div>
      )}
    </div>
  );
}

export default function DocumentIntelligencePage() {
  return (
    <ProtectedRoute>
      <DocumentIntelligenceContent />
    </ProtectedRoute>
  );
}
