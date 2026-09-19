'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useChatHistory, useSendChatMessage } from '@/hooks/useChat';
import { useToast } from '@/lib/toast-context';

const SUGGESTIONS = ['Find me a calculus session', 'How do I add a study session?', 'What does the AI generator do?'];

export function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [input, setInput] = useState('');
  const { data: history } = useChatHistory();
  const sendMessage = useSendChatMessage();
  const logRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      const log = logRef.current;
      if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, history, sendMessage.isPending]);

  if (!user) return null;

  function send(text: string) {
    if (!text.trim()) return;
    setInput('');
    sendMessage.mutate(text, {
      onError: (error) => showToast((error as Error).message, 'error'),
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-coral text-white shadow-xl flex items-center justify-center"
        aria-label="Open AI assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[340px] max-w-[90vw] h-[440px] rounded-2xl bg-white dark:bg-[#1B1F29] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-primary text-paper flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-sm">StudyCo Assistant</p>
              <p className="text-[11px] opacity-70">Knows your bookings and the app</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X className="h-4 w-4" /></button>
          </div>

          <div ref={logRef} className="studyco-scroll flex-1 overflow-y-auto p-4 space-y-3 text-sm">
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
              <div role="status" aria-label="Assistant is typing" className="bg-paperdim dark:bg-[#242938] rounded-xl rounded-tl-none px-3 py-2 w-fit text-xs text-ink/60 dark:text-white/60">
                <span>Typing</span>
                <span aria-hidden="true" className="ml-0.5 inline-flex gap-0.5 align-baseline">
                  <span className="animate-bounce" style={{ animationDelay: '-0.3s' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '-0.15s' }}>.</span>
                  <span className="animate-bounce">.</span>
                </span>
              </div>
            )}
          </div>

          {showSuggestions && (
            <div className="border-t border-black/5 px-3 pb-2 pt-2 dark:border-white/5">
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink/40 dark:text-white/40">Suggestions</span>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="rounded-full p-1 text-ink/40 hover:bg-black/5 hover:text-ink dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Hide suggestions"
                  title="Hide suggestions"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              placeholder="Ask about sessions or bookings"
              className="flex-1 px-3 py-2 rounded-lg bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none"
            />
            <button className="w-9 h-9 rounded-lg bg-primary text-paper flex items-center justify-center" aria-label="Send message">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
