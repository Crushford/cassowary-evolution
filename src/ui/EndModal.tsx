import type { GameState } from '../types/game';

export default function EndModal({
  state,
  onNext,
  onAdmire,
}: {
  state: GameState;
  onNext: () => void;
  onAdmire: () => void;
}) {
  const sel = state.board.selected;
  const survived = sel.filter((i) => state.board.outcomes[i] === 'fruit').length;
  const eggs = state.traits.eggsPerClutch;
  const delta = survived * eggs;

  return (
    <div
      data-testid="end-modal"
      aria-modal="true"
      role="dialog"
      aria-labelledby="end-modal-title"
      className="fixed inset-0 bg-black/60 grid place-items-center p-4"
    >
      <div className="app-surface-2 rounded-2xl p-5 w-full max-w-md">
        <h2 id="end-modal-title" className="text-xl mb-2">
          Season Results
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪺</span>
            <span>
              Nests that survived: <b>{survived}</b> / 3
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🥚</span>
            <span>
              Eggs per clutch: <b>{eggs}</b>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span>
              Population change:{' '}
              <b className={delta > 0 ? 'text-green-400' : 'text-red-400'}>+{delta}</b>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏘️</span>
            <span>
              Total population:{' '}
              <b data-testid="population">{state.progress.population + delta}</b>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕰️</span>
            <span>
              Years elapsed:{' '}
              <b data-testid="years">
                {(
                  state.progress.globalYears + state.recipe.yearsPerRound
                ).toLocaleString()}
              </b>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <span>
              Round: <b data-testid="round">{state.progress.roundInLevel + 1}</b> /{' '}
              {state.recipe.roundsPerLevel}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 justify-end">
          <button
            data-testid="end-round"
            className="px-3 py-2 rounded-xl border border-border/60 text-ink-secondary"
            onClick={onAdmire}
          >
            Admire board
          </button>
          <button
            data-testid="continue"
            className="px-3 py-2 rounded-xl bg-accent text-app-0"
            onClick={onNext}
          >
            Next season
          </button>
        </div>
      </div>
    </div>
  );
}
