import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface GenerateInput {
  type: 'Study notes' | 'Summary' | 'Flashcards' | 'Practice quiz';
  topic: string;
  length: 'Short' | 'Medium' | 'Long';
}

export function useGenerateContent() {
  return useMutation({
    mutationFn: async (input: GenerateInput) => {
      const res = await api.post('/ai/generate', input);
      return res.data.data as { output: string };
    },
  });
}
