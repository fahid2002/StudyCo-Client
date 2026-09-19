import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiEnvelope, BookedSession, BookingRecord, StudySession } from '@/types';

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

export function useSession(id: string, enabled = true) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: async () => {
      const res = await api.get(`/sessions/${id}`);
      return res.data.data as { session: StudySession; reviews: unknown[]; related: StudySession[] };
    },
    enabled: !!id && enabled,
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

export function useBookedSessions() {
  return useQuery({
    queryKey: ['booked-sessions'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<BookedSession[]>>('/sessions/booked');
      return res.data.data;
    },
  });
}

export function useUpdateBooking() {
  return useMutation({
    mutationFn: async (input: { sessionId: string; note: string }) => {
      const res = await api.patch<ApiEnvelope<BookingRecord>>(`/sessions/${input.sessionId}/booking`, { note: input.note });
      return res.data.data;
    },
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await api.delete<ApiEnvelope<{ sessionId: string; seatsReserved: number }>>(`/sessions/${sessionId}/booking`);
      return res.data.data;
    },
  });
}
