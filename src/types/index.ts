export type SessionSubject =
  | 'Mathematics'
  | 'Computer Science'
  | 'Languages'
  | 'Sciences'
  | 'Business'
  | 'Test Prep';

export type SessionMode = 'Online' | 'In-person';
export type SessionLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudySession {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  subject: SessionSubject;
  mode: SessionMode;
  level: SessionLevel;
  price: number;
  date: string;
  imageUrl?: string;
  host: { _id: string; name: string } | string;
  attendees?: string[];
  ratingAverage: number;
  ratingCount: number;
  seatsTotal: number;
  seatsReserved: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  _id: string;
  session: string;
  author: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  interests: string[];
}

export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface Recommendation {
  session: StudySession;
  reason: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: { total: number; page: number; limit: number; pages: number };
}
