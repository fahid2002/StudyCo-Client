export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Why we built StudyCo</h1>
      <p className="mt-5 text-ink/70 dark:text-white/60 leading-relaxed">
        Most study-group apps are event calendars with a chat box bolted on. StudyCo started from a
        narrower question: how do you help two strangers who both need to understand eigenvectors
        by Thursday actually find each other, in the same city or the same time zone, this week?
      </p>
      <p className="mt-4 text-ink/70 dark:text-white/60 leading-relaxed">
        We combine a straightforward listings marketplace with three AI features that stay out of
        the way until they&apos;re useful — generating notes when you&apos;re stuck, recommending
        sessions instead of making you scroll all six subjects, and answering questions about the
        app itself so you&apos;re not digging through a help center.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 mt-10">
        <div><p className="font-display text-2xl font-semibold text-primary dark:text-primary-light">2024</p><p className="text-sm text-ink/50 dark:text-white/40">Founded</p></div>
        <div><p className="font-display text-2xl font-semibold text-primary dark:text-primary-light">140+</p><p className="text-sm text-ink/50 dark:text-white/40">Cities with in-person circles</p></div>
        <div><p className="font-display text-2xl font-semibold text-primary dark:text-primary-light">6</p><p className="text-sm text-ink/50 dark:text-white/40">Subject areas, growing</p></div>
      </div>
    </div>
  );
}
