export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-coral mb-4">About StudyCo</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">StudyCo is built for focused learning.</h1>
        <p className="mt-6 text-lg text-ink/70 dark:text-white/60 leading-relaxed">
          StudyCo is a peer-based study platform designed to help students find the right people, topics, and learning environment for the way they study.
        </p>
      </div>

      <div className="mt-14 space-y-12 text-ink/70 dark:text-white/60 leading-relaxed">
        <section>
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">Why StudyCo exists</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-white">Studying is easier when the right support is within reach.</h2>
          <div className="mt-5 space-y-4">
            <p>
              Many students struggle to stay consistent when they study alone. Finding a relevant study partner or a group with the same subject, level, and goal can also take more time than the studying itself.
            </p>
            <p>
              StudyCo was created to bring those students together in a more focused and organized environment. Instead of searching through unrelated social content, students can connect around the topics they are actually working on.
            </p>
          </div>
        </section>

        <section className="border-t border-black/5 dark:border-white/10 pt-10">
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">What StudyCo brings together</p>
          <p>
            The platform combines peer study sessions, session hosting, reservations, and personal learning support in one place. Students can discover a suitable learning environment, while hosts can create sessions around the subjects and formats they know best.
          </p>
        </section>

        <section className="border-t border-black/5 dark:border-white/10 pt-10">
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">A focused learning space</p>
          <p>
            StudyCo is not just a session listing platform. It brings study discovery, peer collaboration, booking management, and learning support into one focused space—without the distractions of a general social platform.
          </p>
          <p className="mt-4">
            Whether someone is looking for a study partner, organizing a learning session, or trying to stay consistent with their goals, StudyCo is designed to make studying more connected, organized, and purposeful.
          </p>
        </section>
      </div>
    </div>
  );
}
