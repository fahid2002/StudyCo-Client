import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiEnvelope, StudySession } from '@/types';

export interface SessionFilters {
  search?: string;
  subject?: string;
  mode?: string;
  level?: string;
  sort?: 'newest' | 'rating' | 'price';
  page?: number;
  limit?: number;
}

export function useSessions(filters: SessionFilters) {
  return useQuery({
    queryKey: ['sessions', filters],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<StudySession[]>>('/sessions', { params: filters });
      return res.data;
    },
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: async () => {
      const res = await api.get(`/sessions/${id}`);
      return res.data.data as { session: StudySession; reviews: unknown[]; related: StudySession[] };
    },
    enabled: !!id,
  });
}

export function useMySessions() {
  return useQuery({
    queryKey: ['my-sessions'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<StudySession[]>>('/sessions/mine');
      return res.data.data;
    },
  });
}
