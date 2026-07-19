'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useChatHistory, useSendChatMessage } from '@/hooks/useChat';

const PROMPTS = [
  'Recommend a computer science session for this week',
  'What can I do from the manage sessions page?',
  'Help me prepare for my next hosted session',
];

function AssistantContent() {
  const [message, setMessage] = useState('');
  const { data: history } = useChatHistory();
  const sendMessage = useSendChatMessage();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, sendMessage.isPending]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessage('');
    sendMessage.mutate(text);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-14 grid lg:grid-cols-[280px_1fr] gap-6">
      <aside className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-5 h-fit">
        <h1 className="font-display text-2xl font-semibold">AI study assistant</h1>
        <div className="mt-5 space-y-2">
          {PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="w-full text-left text-sm px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 hover:border-primary"
            >
              {prompt}
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] min-h-[620px] flex flex-col overflow-hidden">
        <div ref={logRef} className="flex-1 overflow-y-auto p-5 space-y-3">
          {(history ?? []).length === 0 && (
            <div className="text-sm text-ink/50 dark:text-white/40">
              Ask about StudyCo navigation, your hosted sessions, recommendations, or study planning.
            </div>
          )}
          {(history ?? []).map((item, index) => (
            <div
              key={item._id ?? index}
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                item.role === 'assistant'
                  ? 'bg-paperdim dark:bg-[#242938] rounded-tl-none'
                  : 'bg-primary text-paper rounded-tr-none ml-auto'
              }`}
            >
              {item.content}
            </div>
          ))}
          {sendMessage.isPending && (
            <div className="bg-paperdim dark:bg-[#242938] rounded-2xl rounded-tl-none px-4 py-3 w-fit text-sm">Typing...</div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(message);
          }}
          className="p-4 border-t border-black/10 dark:border-white/10 flex gap-3"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask the assistant"
            className="flex-1 px-4 py-3 rounded-xl bg-paperdim dark:bg-[#12151C] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="px-4 py-3 rounded-xl bg-primary text-paper font-semibold flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <ProtectedRoute>
      <AssistantContent />
    </ProtectedRoute>
  );
}
