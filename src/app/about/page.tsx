export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Why we built StudyCo</h1>
      <p className="mt-5 text-ink/70 dark:text-white/60 leading-relaxed">
        Most study-group apps are event calendars with a chat box bolted on. StudyCo starts from a narrower question:
        how do students who need the same topic, the same week, find each other without scrolling through irrelevant posts?
      </p>
      <p className="mt-4 text-ink/70 dark:text-white/60 leading-relaxed">
        The platform combines searchable study-session listings with AI tools for notes, recommendations, document analysis,
        and contextual support while keeping every hosted session tied to a real account in MongoDB.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 mt-10">
        <div><p className="font-display text-2xl font-semibold text-primary dark:text-primary-light">2024</p><p className="text-sm text-ink/50 dark:text-white/40">Founded</p></div>
        <div><p className="font-display text-2xl font-semibold text-primary dark:text-primary-light">140+</p><p className="text-sm text-ink/50 dark:text-white/40">Cities with in-person circles</p></div>
        <div><p className="font-display text-2xl font-semibold text-primary dark:text-primary-light">6</p><p className="text-sm text-ink/50 dark:text-white/40">Subject areas, growing</p></div>
      </div>
    </div>
  );
}
