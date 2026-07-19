'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { StudyCoLogo } from './StudyCoLogo';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const authedLinks = (
    <>
      {user && <Link href="/items/add" className="hover:text-primary dark:hover:text-primary-light">Add Session</Link>}
      {user && <Link href="/items/manage" className="hover:text-primary dark:hover:text-primary-light">My Sessions</Link>}
    </>
  );

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-paper/90 dark:bg-[#12151C]/90 border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <StudyCoLogo />

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary dark:hover:text-primary-light">Home</Link>
          <Link href="/explore" className="hover:text-primary dark:hover:text-primary-light">Explore</Link>
          <Link href="/ai/assistant" className="hover:text-primary dark:hover:text-primary-light">AI Assistant</Link>
          {authedLinks}
          <Link href="/about" className="hover:text-primary dark:hover:text-primary-light">About</Link>
          <Link href="/contact" className="hover:text-primary dark:hover:text-primary-light">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center"
          >
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="text-sm font-semibold px-3 py-2 hover:text-primary dark:hover:text-primary-light">Log in</Link>
              <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-full bg-primary text-paper hover:bg-primary-dark">Sign up</Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
              <span className="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center text-xs font-bold">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <button onClick={logout} className="text-sm font-semibold px-3 py-2 hover:text-coral">Log out</button>
            </div>
          )}

          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-black/10 dark:border-white/10 px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-paper dark:bg-[#12151C]">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/ai/assistant">AI Assistant</Link>
          {user && <Link href="/items/add">Add Session</Link>}
          {user && <Link href="/items/manage">My Sessions</Link>}
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {!user ? (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/register">Sign up</Link>
            </>
          ) : (
            <button onClick={logout} className="text-left text-coral">Log out</button>
          )}
        </div>
      )}
    </nav>
  );
}
