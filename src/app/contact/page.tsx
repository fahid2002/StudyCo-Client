'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '');
    const email = String(form.get('email') ?? '');
    const message = String(form.get('message') ?? '');
    window.location.href = `mailto:support@studyco.app?subject=${encodeURIComponent(`StudyCo contact from ${name}`)}&body=${encodeURIComponent(`${message}\n\nReply to: ${email}`)}`;
    setSent(true);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display text-3xl font-semibold">Get in touch</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input name="name" required placeholder="Name" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input name="email" required type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea name="message" required rows={4} placeholder="How can we help?" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button className="px-6 py-3 rounded-xl bg-primary text-paper font-semibold">Send message</button>
          {sent && <p className="text-sm text-primary dark:text-primary-light">Your email app opened with the message ready to send.</p>}
        </form>
      </div>
      <div className="space-y-5 text-sm">
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Email</p><p className="font-medium">support@studyco.app</p></div>
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Phone</p><p className="font-medium">+880 1234-567890</p></div>
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Office</p><p className="font-medium">House 12, Road 4, Dhanmondi, Dhaka</p></div>
        <div><p className="font-mono text-xs text-ink/40 dark:text-white/40 uppercase">Hours</p><p className="font-medium">Sunday to Thursday, 9:00 to 18:00</p></div>
      </div>
    </div>
  );
}
