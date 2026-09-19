import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useSendContactMessage() {
  return useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const response = await api.post('/contact', payload);
      return response.data.data as { id: string; message: string };
    },
  });
}
