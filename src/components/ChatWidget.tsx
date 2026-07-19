'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useChatHistory, useSendChatMessage } from '@/hooks/useChat';

const SUGGESTIONS = ['Find me a calculus session', 'How do I add a study session?', 'What does the AI generator do?'];

export function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { data: history } = useChatHistory();
  const sendMessage = useSendChatMessage();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [history, sendMessage.isPending]);

  if (!user) return null; // Assistant is context-aware of the logged-in student's sessions.

  function send(text: string) {
    if (!text.trim()) return;
    setInput('');
    sendMessage.mutate(text);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-coral text-white shadow-xl flex items-center justify-center text-xl"
        aria-label="Open AI assistant"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[340px] max-w-[90vw] h-[440px] rounded-2xl bg-white dark:bg-[#1B1F29] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-primary text-paper flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-sm">StudyCo Assistant</p>
              <p className="text-[11px] opacity-70">Knows your bookings &amp; the app</p>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div ref={logRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {(history ?? []).map((m, i) => (
              <div
                key={m._id ?? i}
                className={
                  m.role === 'assistant'
                    ? 'bg-paperdim dark:bg-[#242938] rounded-xl rounded-tl-none px-3 py-2 max-w-[85%]'
                    : 'bg-primary text-paper rounded-xl rounded-tr-none px-3 py-2 max-w-[85%] ml-auto'
                }
              >
                {m.content}
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="bg-paperdim dark:bg-[#242938] rounded-xl rounded-tl-none px-3 py-2 w-fit text-xs">Typing…</div>
            )}
          </div>

          <div className="px-3 flex gap-2 flex-wrap pb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-black/10 dark:border-white/10 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sessions, bookings…"
              className="flex-1 px-3 py-2 rounded-lg bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none"
            />
            <button className="w-9 h-9 rounded-lg bg-primary text-paper flex items-center justify-center">➤</button>
          </form>
        </div>
      )}
    </>
  );
}
