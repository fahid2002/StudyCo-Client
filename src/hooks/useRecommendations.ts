import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiEnvelope, Recommendation } from '@/types';

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Recommendation[]>>('/ai/recommendations');
      return res.data.data;
    },
  });
}

export function useRecommendationFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { sessionId: string; vote: 'up' | 'down' }) => {
      const res = await api.post<ApiEnvelope<Recommendation[]>>('/ai/recommendations/feedback', payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(['recommendations'], data);
    },
  });
}
