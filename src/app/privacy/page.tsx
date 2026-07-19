export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-semibold">Privacy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/70 dark:text-white/60">
        <p>StudyCo stores account details, hosted sessions, recommendation feedback, generated study content, and assistant messages so the application can provide authenticated study workflows.</p>
        <p>Uploaded study documents are processed for analysis and deleted from temporary server storage after extraction. Account data is protected by JWT authentication and database access controls.</p>
        <p>For privacy questions, contact support@studyco.app.</p>
      </div>
    </div>
  );
}
