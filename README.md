# StudyCo Client

StudyCo is a full-stack study-session booking and AI study assistant platform. This repository contains the Next.js client application used by students to browse sessions, reserve seats, manage study tools, generate notes, practice flashcards/quizzes, and interact with the AI assistant.

## Live Links

- Live client: https://studyco-client.vercel.app
- Live API: https://studyco-server.onrender.com/api
- Client repository: https://github.com/fahid2002/StudyCo-Client
- Server repository: https://github.com/fahid2002/StudyCo-Server
- LinkedIn: https://www.linkedin.com/in/fahid-hasan/

## Project Summary

StudyCo helps students find and manage study support in one place. Users can create an account, sign in with email/password or Google, browse real MongoDB-backed study sessions, reserve a seat, bookmark sessions, create their own sessions, and use AI-powered tools for notes, document summaries, flashcards, quizzes, and study planning.

The UI supports dark and light mode, protected dashboard pages, toast feedback, responsive layouts, DOCX downloads, and a floating chat assistant.

## Features

- Email/password authentication and Google OAuth login/register.
- Demo login for quick testing.
- Protected dashboard for logged-in users.
- Browse, search, filter, sort, and view study sessions.
- Subject cards on the home page link directly to filtered Explore results.
- Add, manage, delete, and reserve study sessions.
- Bookmark/favorite sessions and view them later.
- AI assistant with streaming responses.
- AI notes generator with study notes, summaries, flashcards, and practice quiz content.
- AI "Explain Simply" mode.
- AI document intelligence for PDF, DOCX, and TXT uploads.
- Saved notes library with search, folders, reading view, and DOCX download.
- Flashcard practice mode from saved notes.
- Quiz practice mode with score tracking.
- Study timetable/reminder planner.
- Activity history stored in MongoDB through the API.
- Contact form using EmailJS.
- Responsive 404 page, favicon, and StudyCo logo.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- Recharts
- Lucide React
- Google OAuth
- EmailJS
- DOCX export with `docx`

## Folder Structure

```text
src/
  app/                 # Next.js App Router pages
  components/          # Shared UI components
  hooks/               # Data-fetching and mutation hooks
  lib/                 # Axios, auth, toast, document helpers
  types/               # Shared TypeScript types
```

## Local Setup

1. Clone the repository.

```bash
git clone https://github.com/fahid2002/StudyCo-Client.git
cd StudyCo-Client
```

2. Install dependencies.

```bash
npm install
```

3. Create or update `.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

4. Start the development server.

```bash
npm run dev
```

5. Open the app.

```text
http://localhost:3000
```

The backend server should be running at `http://localhost:5000/api`.

## Available Scripts

```bash
npm run dev      # Start local development server
npm run build    # Create production build
npm run start    # Run the production build locally
npm run lint     # Run Next.js linting
```

## Important Routes

- `/` - Home page
- `/explore` - Browse study sessions
- `/session/[id]` - Session details and reservation
- `/login` - Login
- `/register` - Registration
- `/dashboard` - User dashboard
- `/items/add` - Add a study session
- `/items/manage` - Manage my sessions
- `/ai/assistant` - AI chat assistant
- `/ai/generator` - AI notes generator
- `/ai/document` - AI document intelligence
- `/ai/recommendations` - AI recommendations
- `/notes` - Saved notes library
- `/flashcards` - Flashcard practice
- `/quiz` - Quiz practice
- `/timetable` - Study timetable
- `/bookmarks` - Bookmarked sessions
- `/contact` - Contact form

## Deployment

The client is deployed on Vercel.

Production environment variables should include:

```env
NEXT_PUBLIC_API_URL=https://studyco-server.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Google OAuth must allow these JavaScript origins:

```text
http://localhost:3000
https://studyco-client.vercel.app
```

## Credits

Developed by Fahid Hasan.

- GitHub: https://github.com/fahid2002
- LinkedIn: https://www.linkedin.com/in/fahid-hasan/

This project was built for an Agentic AI full-stack assignment using Next.js, Express, MongoDB, JWT authentication, Google OAuth, Gemini AI, and a custom StudyCo UI design.
