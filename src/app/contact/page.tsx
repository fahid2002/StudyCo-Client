'use client';

import { useState } from 'react';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [status, setStatus] = useState<SendState>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const subject = `StudyCo contact from ${name}`;
    const message = String(formData.get('message') ?? '');

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      setStatus('sending');
      setError('');
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              name,
              email,
              subject,
              message,
            },
          }),
        });

        if (!response.ok) throw new Error('EmailJS could not send the message.');
        setStatus('sent');
        formElement.reset();
        return;
      } catch (err) {
        setStatus('error');
        setError((err as Error).message);
        return;
      }
    }

    window.location.href = `mailto:support@studyco.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\nReply to: ${email}`)}`;
    setStatus('sent');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display text-3xl font-semibold">Get in touch</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input name="name" required placeholder="Name" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input name="email" required type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea name="message" required rows={4} placeholder="How can we help?" className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1B1F29] text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button disabled={status === 'sending'} className="px-6 py-3 rounded-xl bg-primary text-paper font-semibold disabled:opacity-60">
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>
          {status === 'sent' && <p className="text-sm text-primary dark:text-primary-light">Message ready or sent successfully.</p>}
          {status === 'error' && <p className="text-sm text-coral">{error}</p>}
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
