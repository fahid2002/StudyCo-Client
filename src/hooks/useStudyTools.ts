import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiEnvelope, Bookmark, QuizScore, SavedNote, TimetableItem } from '@/types';

export function useSavedNotes(filters: { search?: string; folder?: string } = {}) {
  return useQuery({
    queryKey: ['saved-notes', filters],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<SavedNote[]>>('/study/notes', { params: filters });
      return res.data.data;
    },
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; folder: string; content: string; source?: string }) => {
      const res = await api.post<ApiEnvelope<SavedNote>>('/study/notes', payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-notes'] }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/study/notes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-notes'] }),
  });
}

export function useBookmarks(enabled = true) {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Bookmark[]>>('/study/bookmarks');
      return res.data.data;
    },
    enabled,
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await api.post<ApiEnvelope<{ bookmarked: boolean }>>(`/study/bookmarks/${sessionId}`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      qc.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useTimetable() {
  return useQuery({
    queryKey: ['timetable'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<TimetableItem[]>>('/study/timetable');
      return res.data.data;
    },
  });
}

export function useCreateTimetableItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; subject: string; startAt: string; notes?: string }) => {
      const res = await api.post<ApiEnvelope<TimetableItem>>('/study/timetable', payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timetable'] }),
  });
}

export function useDeleteTimetableItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/study/timetable/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timetable'] }),
  });
}

export function useQuizScores() {
  return useQuery({
    queryKey: ['quiz-scores'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<QuizScore[]>>('/study/quiz-scores');
      return res.data.data;
    },
  });
}

export function useCreateQuizScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { topic: string; score: number; total: number }) => {
      const res = await api.post<ApiEnvelope<QuizScore>>('/study/quiz-scores', payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quiz-scores'] }),
  });
}
