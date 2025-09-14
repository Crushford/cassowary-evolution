import { useEffect, useReducer } from 'react';
import { initState, reducer } from './game/reducer';
import { RealTimers, ImmediateTimers } from './lib/timers';
import IntroModal from './ui/IntroModal';
import EndModal from './ui/EndModal';
import LevelCompleteModal from './ui/LevelCompleteModal';
import LevelOneBoard from './ui/LevelOneBoard';
import HUD from './ui/HUD';
import { EvolutionModal } from './components/EvolutionModal';
import { Toast } from './components/Toast';

export default function App() {
  const params = new URLSearchParams(location.search);
  const seed = params.get('seed') ?? undefined;
  const testMode = params.get('testMode') === '1';
  const fastPeek = params.get('fastPeek') === '1';

  const [state, dispatch] = useReducer(reducer, undefined!, () =>
    initState(seed, testMode, fastPeek),
  );

  // Toggle motion-off on html for tests/reduced motion
  useEffect(() => {
    const off =
      state.ui.testMode ||
      (typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false);
    document.documentElement.classList.toggle('motion-off', off);
  }, [state.ui.testMode]);

  // Full-board peek after 3rd placement (1s) then end modal (1s)
  useEffect(() => {
    if (state.board.selected.length !== state.recipe.picksPerRound) return;
    const timers = state.ui.fastPeek ? ImmediateTimers : RealTimers;
    const t1 = timers.delay(1000, () => dispatch({ type: 'FULL_REVEAL' }));
    const t2 = timers.delay(2000, () => dispatch({ type: 'SHOW_END_MODAL' }));
    return () => {
      timers.clear(t1);
      timers.clear(t2);
    };
  }, [state.board.selected.length, state.recipe.picksPerRound, state.ui.fastPeek]);

  return (
    <div className="min-h-screen bg-app-0 text-ink-primary">
      <HUD
        state={state}
        onShowEvolution={() => dispatch({ type: 'SHOW_EVOLUTION_MODAL' })}
      />
      <main className="max-w-3xl mx-auto p-4">
        <LevelOneBoard
          state={state}
          onPlace={(i) => dispatch({ type: 'PLACE', index: i })}
        />
      </main>

      {state.ui.showIntro && (
        <IntroModal onBegin={() => dispatch({ type: 'CLOSE_INTRO' })} />
      )}
      {state.ui.showEndModal && (
        <EndModal
          state={state}
          onNext={() => dispatch({ type: 'NEXT_SEASON' })}
          onAdmire={() => dispatch({ type: 'ADMIRE_BOARD' })}
        />
      )}

      {state.ui.admireMode && (
        <button
          data-testid="btn-return-results"
          className="fixed bottom-4 right-4 px-4 py-2 rounded-xl bg-accent text-app-0"
          onClick={() => dispatch({ type: 'RETURN_RESULTS' })}
        >
          Return to results
        </button>
      )}

      {state.ui.showLevelComplete && (
        <LevelCompleteModal onAdvance={() => dispatch({ type: 'ADVANCE_LEVEL' })} />
      )}

      {state.ui.showEvolutionModal && (
        <EvolutionModal
          gameState={state}
          onClose={() => dispatch({ type: 'CLOSE_EVOLUTION_MODAL' })}
          onPurchaseNode={(nodeId) =>
            dispatch({ type: 'PURCHASE_EVOLUTION_NODE', nodeId })
          }
        />
      )}

      <Toast
        message={state.ui.boardGrowthMessage}
        isVisible={state.ui.showBoardGrowthToast}
        onDismiss={() => dispatch({ type: 'DISMISS_BOARD_GROWTH_TOAST' })}
        type="success"
        duration={4000}
      />

      <Toast
        message={state.ui.epGainMessage}
        isVisible={state.ui.showEPGainToast}
        onDismiss={() => dispatch({ type: 'DISMISS_EP_GAIN_TOAST' })}
        type="info"
        duration={3000}
      />
    </div>
  );
}
