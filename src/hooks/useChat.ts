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
