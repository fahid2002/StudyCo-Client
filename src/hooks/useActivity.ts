import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Activity, ApiEnvelope } from '@/types';

export function useActivityHistory() {
  return useQuery({
    queryKey: ['activity-history'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Activity[]>>('/activity');
      return res.data.data;
    },
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/activity/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activity-history'] }),
  });
}

export function useClearActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete('/activity');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activity-history'] }),
  });
}
