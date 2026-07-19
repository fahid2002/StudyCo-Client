import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiEnvelope, ChatMessage } from '@/types';

export function useChatHistory() {
  return useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<ChatMessage[]>>('/ai/chat');
      return res.data.data;
    },
  });
}

export function useSendChatMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await api.post('/ai/chat', { message });
      return res.data.data as { reply: string };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chat-history'] }),
  });
}

function getApiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

export function useSendStreamingChatMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      onToken,
    }: {
      message: string;
      onToken: (token: string) => void;
    }) => {
      const token = localStorage.getItem('studyco_token');
      const response = await fetch(getApiUrl('/ai/chat/stream'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok || !response.body) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'The assistant could not respond.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let reply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const eventType = event
            .split('\n')
            .find((line) => line.startsWith('event: '))
            ?.replace('event: ', '');
          const dataLine = event.split('\n').find((line) => line.startsWith('data: '));
          if (!dataLine) continue;

          const data = JSON.parse(dataLine.replace('data: ', '')) as { token?: string; message?: string };

          if (eventType === 'error') {
            throw new Error(data.message || 'The assistant stream failed.');
          }

          if (data.token) {
            reply += data.token;
            onToken(data.token);
          }
        }
      }

      return { reply };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chat-history'] }),
  });
}
