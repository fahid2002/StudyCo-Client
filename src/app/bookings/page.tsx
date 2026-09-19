'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SessionCard, SessionCardSkeleton } from '@/components/SessionCard';
import { useBookedSessions, useCancelBooking, useUpdateBooking } from '@/hooks/useSessions';
import { BookedSession } from '@/types';
import { useToast } from '@/lib/toast-context';

function BookingsContent() {
  const { data: bookings, isLoading, error } = useBookedSessions();
  const updateBooking = useUpdateBooking();
  const cancelBooking = useCancelBooking();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<BookedSession | null>(null);
  const [note, setNote] = useState('');

  function openEditor(item: BookedSession) {
    setEditing(item);
    setNote(item.booking?.note ?? '');
  }

  function closeEditor() {
    if (!updateBooking.isPending) {
      setEditing(null);
      setNote('');
    }
  }

  function saveBooking() {
    if (!editing) return;

    updateBooking.mutate(
      { sessionId: editing.session._id, note },
      {
        onSuccess: (booking) => {
          queryClient.setQueryData<BookedSession[]>(['booked-sessions'], (current) =>
            current?.map((item) => item.session._id === editing.session._id ? { ...item, booking } : item)
          );
          showToast('Booking details updated successfully.', 'success');
          setEditing(null);
          setNote('');
        },
        onError: (requestError) => showToast((requestError as Error).message, 'error'),
      }
    );
  }

  function cancelOne(item: BookedSession) {
    if (cancelBooking.isPending || !window.confirm(`Cancel your booking for “${item.session.title}”? The seat will be released.`)) return;

    cancelBooking.mutate(item.session._id, {
      onSuccess: () => {
        queryClient.setQueryData<BookedSession[]>(['booked-sessions'], (current) =>
          current?.filter((booking) => booking.session._id !== item.session._id)
        );
        showToast('Booking cancelled and the seat was released.', 'success');
      },
      onError: (requestError) => showToast((requestError as Error).message, 'error'),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-coral">Dashboard</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">My Bookings</h1>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-2">
          Review your reserved sessions and update your booking note.
        </p>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {Array.from({ length: 4 }).map((_, index) => <SessionCardSkeleton key={index} />)}
        </div>
      )}

      {!isLoading && error && (
        <p className="mt-8 rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">
          {(error as Error).message}
        </p>
      )}

      {!isLoading && !error && bookings?.length === 0 && (
        <div className="mt-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1B1F29] p-8 text-center">
          <h2 className="font-display text-xl font-semibold">No bookings yet</h2>
          <p className="text-sm text-ink/60 dark:text-white/50 mt-2">
            Reserve a session from Explore and it will appear here.
          </p>
        </div>
      )}

      {!isLoading && !error && bookings && bookings.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {bookings.map((item) => (
            <div key={item.session._id} className="flex h-full flex-col gap-3">
              <SessionCard session={item.session} />
              <button
                type="button"
                onClick={() => openEditor(item)}
                className="w-full rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary dark:text-primary-light"
              >
                Edit booking note
              </button>
              <button
                type="button"
                onClick={() => cancelOne(item)}
                disabled={cancelBooking.isPending}
                className="w-full rounded-xl border border-coral px-4 py-2.5 text-sm font-semibold text-coral disabled:opacity-50"
              >
                {cancelBooking.isPending ? 'Cancelling...' : 'Cancel booking'}
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white p-6 shadow-2xl dark:bg-[#1B1F29]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-coral">Edit booking</p>
                <h2 className="font-display text-2xl font-semibold mt-1">{editing.session.title}</h2>
              </div>
              <button type="button" onClick={closeEditor} className="text-sm text-ink/50 dark:text-white/50" disabled={updateBooking.isPending}>
                Close
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-paperdim p-4 text-sm dark:bg-[#12151C]">
              <p><span className="text-ink/50 dark:text-white/40">Session date:</span> {new Date(editing.session.date).toLocaleString()}</p>
              <p className="mt-1"><span className="text-ink/50 dark:text-white/40">Format:</span> {editing.session.mode}</p>
              <p className="mt-1"><span className="text-ink/50 dark:text-white/40">Host:</span> {typeof editing.session.host === 'string' ? 'Host' : editing.session.host.name}</p>
            </div>

            <label className="mt-5 block text-sm font-medium" htmlFor="booking-note">Booking note</label>
            <textarea
              id="booking-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Add a note for this booking..."
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-white/15 dark:bg-[#12151C]"
            />
            <p className="mt-1 text-right text-xs text-ink/40 dark:text-white/40">{note.length}/500</p>

            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={closeEditor} disabled={updateBooking.isPending} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold dark:border-white/15">
                Cancel
              </button>
              <button type="button" onClick={saveBooking} disabled={updateBooking.isPending} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-50">
                {updateBooking.isPending ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
