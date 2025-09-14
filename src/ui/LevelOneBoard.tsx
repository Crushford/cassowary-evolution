import type { GameState } from '../types/game';

export default function LevelOneBoard({
  state,
  onPlace,
}: {
  state: GameState;
  onPlace: (i: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Tray: 3 figurines */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            data-testid={`tray-slot-${i}`}
            className={`w-10 h-10 rounded-full border border-border/60 flex items-center justify-center ${
              state.board.selected[i] != null ? 'bg-accent' : 'bg-app-2'
            }`}
          >
            {state.board.selected[i] != null ? (
              <span className="text-lg">
                {state.board.outcomes[state.board.selected[i]] === 'fruit'
                  ? '🍎'
                  : state.board.outcomes[state.board.selected[i]] === 'barren'
                    ? '🏜️'
                    : state.board.outcomes[state.board.selected[i]] === 'predator'
                      ? '🦅'
                      : '❓'}
              </span>
            ) : (
              <span className="text-sm opacity-50">?</span>
            )}
          </div>
        ))}
      </div>

      {/* 5 nest cards row */}
      <div className="grid grid-cols-5 gap-3">
        {state.board.outcomes.map((_, i) => {
          const s = state.board.revealed[i]; // "hidden"|"revealed"|"shadow"
          const selected = state.board.selected.includes(i);
          const canClick =
            s === 'hidden' &&
            state.board.selected.length < state.recipe.picksPerRound &&
            !state.ui.blocking;
          return (
            <div
              key={i}
              data-testid={`card-${i}`}
              data-state={s}
              onClick={canClick ? () => onPlace(i) : undefined}
              className={[
                'relative w-32 h-44 rounded-xl border border-border/60 overflow-hidden app-surface',
                'transition-transform duration-[var(--t-xs)] ease-[var(--ease-out)]',
                selected ? 'ring-2 ring-ring' : '',
                canClick ? 'cursor-pointer hover:-translate-y-1' : 'cursor-default',
              ].join(' ')}
            >
              {/* back (hidden) */}
              <div
                className={`absolute inset-0 grid place-items-center ${
                  s === 'hidden' ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-[var(--t-xs)]`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🪺</div>
                  <div className="text-sm">Nest</div>
                </div>
              </div>
              {/* front (revealed/shadow) */}
              <div
                className={`absolute inset-0 grid place-items-center ${
                  s !== 'hidden' ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-[var(--t-xs)] ${s === 'shadow' ? 'brightness-75 opacity-80' : ''}`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-1">
                    {state.board.outcomes[i] === 'fruit'
                      ? '🍎'
                      : state.board.outcomes[i] === 'barren'
                        ? '🏜️'
                        : state.board.outcomes[i] === 'predator'
                          ? '🦅'
                          : '❓'}
                  </div>
                  <div className="text-sm font-medium">
                    {state.board.outcomes[i] === 'fruit'
                      ? 'Fruit'
                      : state.board.outcomes[i] === 'barren'
                        ? 'Barren'
                        : state.board.outcomes[i] === 'predator'
                          ? 'Predator'
                          : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
