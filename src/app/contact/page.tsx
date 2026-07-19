'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Wire this up to a POST /api/contact route (and e.g. an email service) when ready.
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display text-3xl font-semibold">Get in touch</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input required placeholder="Name" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input required type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea required rows={4} placeholder="How can we help?" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button className="px-6 py-3 rounded-xl bg-primary text-paper font-semibold">Send message</button>
          {sent && <p className="text-sm text-primary dark:text-primary-light">Message sent — we reply within one business day.</p>}
        </form>
      </div>
      <div className="space-y-5 text-sm">
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Email</p><p className="font-medium">support@studyco.app</p></div>
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Phone</p><p className="font-medium">+880 1234-567890</p></div>
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Office</p><p className="font-medium">House 12, Road 4, Dhanmondi, Dhaka</p></div>
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Hours</p><p className="font-medium">Sun–Thu, 9:00–18:00</p></div>
      </div>
    </div>
  );
}
