import type { GameState } from '../types/game';

interface HUDProps {
  state: GameState;
  onShowEvolution?: () => void;
}

export default function HUD({ state, onShowEvolution }: HUDProps) {
  const handleExport = () => {
    const blob = { progress: state.progress, equipped: state.equipped };
    navigator.clipboard.writeText(JSON.stringify(blob));
  };

  const handleImport = () => {
    const input = prompt('Paste your save data:');
    if (input) {
      try {
        const blob = JSON.parse(input);
        if (blob.progress && blob.equipped) {
          // This would need to be handled by the parent component
          // For now, just show an alert
          alert('Import functionality needs to be wired up to the reducer');
        }
      } catch {
        alert('Invalid save data');
      }
    }
  };

  return (
    <header className="w-full bg-app-1/40 border-b border-border/60">
      <div className="max-w-3xl mx-auto p-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span>
            Level {state.progress.currentLevel} · {state.recipe.name}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span>🔄</span>
            <span>
              Round <b data-testid="round">{state.progress.roundInLevel}</b>/
              {state.recipe.roundsPerLevel}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span>🕰️</span>
            <span>
              Years{' '}
              <b data-testid="years">{state.progress.globalYears.toLocaleString()}</b>
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span>👥</span>
            <span>
              Pop <b data-testid="population">{state.progress.population}</b>
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span>🧬</span>
            <span>
              EP <b data-testid="ep-balance">{state.progress.evolutionPoints}</b>
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span>🪺</span>
            <span>
              <span data-testid="board-card-count">{state.board.outcomes.length}</span>{' '}
              <span data-testid="board-scale-label">nest</span>
            </span>
          </span>
          <div className="flex gap-2">
            {onShowEvolution && (
              <button
                data-testid="evolution-open"
                className="px-2 py-1 text-xs rounded bg-purple-600 hover:bg-purple-700 text-white"
                onClick={onShowEvolution}
              >
                Evolution
              </button>
            )}
            <button
              data-testid="btn-export"
              className="px-2 py-1 text-xs rounded bg-app-2 hover:bg-app-1"
              onClick={handleExport}
            >
              Export
            </button>
            <button
              data-testid="btn-import"
              className="px-2 py-1 text-xs rounded bg-app-2 hover:bg-app-1"
              onClick={handleImport}
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
