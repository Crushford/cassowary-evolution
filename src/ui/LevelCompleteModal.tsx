export default function LevelCompleteModal({ onAdvance }: { onAdvance: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center p-4">
      <div className="app-surface-2 rounded-2xl p-5 w-full max-w-md">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl mb-2">Level Complete!</h2>
        </div>
        <p className="text-ink-secondary text-center">
          The world is changing… prepare for new odds.
        </p>
        <div className="mt-4 text-right">
          <button
            className="px-3 py-2 rounded-xl bg-accent text-app-0"
            onClick={onAdvance}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
