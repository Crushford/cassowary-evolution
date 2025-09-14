export default function IntroModal({ onBegin }: { onBegin: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 grid place-items-center p-4"
      data-testid="intro-modal"
    >
      <div className="app-surface-2 rounded-2xl p-5 w-full max-w-lg">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🦘</div>
          <h1 className="text-2xl mb-2">Cassowary Queen — Fruit Era</h1>
        </div>
        <p className="text-ink-secondary mb-4">
          Choose <b>3 nests</b> each season. In this era, <b>3 of 5</b> have{' '}
          <b>🍎 Fruit</b>, <b>2</b> are <b>🏜️ Barren</b>. Each round is{' '}
          <b>100,000 years</b>. Reach population milestones to evolve.
        </p>
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <span>🍎</span>
            <span>Fruit = Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏜️</span>
            <span>Barren = Bad</span>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            data-testid="intro-next"
            className="px-3 py-2 rounded-xl bg-accent text-app-0"
            onClick={onBegin}
          >
            Begin Level 1
          </button>
          <button
            data-testid="intro-skip"
            className="px-3 py-2 rounded-xl bg-app-2 text-ink-primary"
            onClick={onBegin}
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
