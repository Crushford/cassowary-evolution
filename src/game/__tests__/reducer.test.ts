import { nestCardsReducer, createInitialNestCardsState } from '../nestCardsReducer';

describe('NestCardsReducer', () => {
  test('INIT creates initial state', () => {
    const state = nestCardsReducer(createInitialNestCardsState(), {
      type: 'INIT',
      payload: { seed: 'test-seed', testMode: true, fastPeek: true },
    });

    expect(state.progress.seed).toBe('test-seed');
    expect(state.ui.testMode).toBe(true);
    expect(state.ui.fastPeek).toBe(true);
    expect(state.board.outcomes).toHaveLength(5);
    expect(state.board.selected).toHaveLength(0);
    expect(state.board.revealed).toEqual([
      'hidden',
      'hidden',
      'hidden',
      'hidden',
      'hidden',
    ]);
  });

  test('PLACE adds selection and reveals card', () => {
    const initialState = createInitialNestCardsState();
    const state = nestCardsReducer(initialState, {
      type: 'PLACE',
      payload: { index: 0 },
    });

    expect(state.board.selected).toEqual([0]);
    expect(state.board.revealed[0]).toBe('revealed');
    expect(state.board.revealed[1]).toBe('hidden');
  });

  test('PLACE prevents duplicate selections', () => {
    const initialState = createInitialNestCardsState();
    let state = nestCardsReducer(initialState, {
      type: 'PLACE',
      payload: { index: 0 },
    });

    // Try to place same card again
    state = nestCardsReducer(state, {
      type: 'PLACE',
      payload: { index: 0 },
    });

    expect(state.board.selected).toEqual([0]);
  });

  test('FULL_REVEAL shows all hidden cards as shadow', () => {
    const initialState = createInitialNestCardsState();
    let state = nestCardsReducer(initialState, {
      type: 'PLACE',
      payload: { index: 0 },
    });

    state = nestCardsReducer(state, { type: 'FULL_REVEAL' });

    expect(state.board.revealed[0]).toBe('revealed'); // already revealed
    expect(state.board.revealed[1]).toBe('shadow');
    expect(state.board.revealed[2]).toBe('shadow');
    expect(state.board.revealed[3]).toBe('shadow');
    expect(state.board.revealed[4]).toBe('shadow');
    expect(state.board.fullyRevealed).toBe(true);
  });

  test('SHOW_END_MODAL calculates population correctly', () => {
    const initialState = createInitialNestCardsState();
    // Mock outcomes: first 3 are fruit, last 2 are barren
    initialState.board.outcomes = ['fruit', 'fruit', 'fruit', 'barren', 'barren'];
    initialState.board.selected = [0, 1, 2]; // All fruit selected

    const state = nestCardsReducer(initialState, { type: 'SHOW_END_MODAL' });

    expect(state.ui.showEndModal).toBe(true);
    expect(state.progress.population).toBe(3 + 3 * 3); // initial 3 + (3 survived * 3 eggs)
  });

  test('NEXT_SEASON resets board and advances round', () => {
    const initialState = createInitialNestCardsState();
    initialState.board.selected = [0, 1, 2];
    initialState.board.revealed = [
      'revealed',
      'revealed',
      'revealed',
      'shadow',
      'shadow',
    ];
    initialState.progress.roundInLevel = 0;
    initialState.progress.globalRound = 0;
    initialState.progress.globalYears = 0;

    const state = nestCardsReducer(initialState, { type: 'NEXT_SEASON' });

    expect(state.board.selected).toEqual([]);
    expect(state.board.revealed).toEqual([
      'hidden',
      'hidden',
      'hidden',
      'hidden',
      'hidden',
    ]);
    expect(state.board.fullyRevealed).toBe(false);
    expect(state.progress.roundInLevel).toBe(1);
    expect(state.progress.globalRound).toBe(1);
    expect(state.progress.globalYears).toBe(100000);
    expect(state.ui.showEndModal).toBe(false);
  });

  test('ADVANCE_LEVEL moves to next level', () => {
    const initialState = createInitialNestCardsState();
    initialState.progress.currentLevel = 1;
    initialState.ui.showLevelComplete = true;

    const state = nestCardsReducer(initialState, { type: 'ADVANCE_LEVEL' });

    expect(state.progress.currentLevel).toBe(2);
    expect(state.progress.roundInLevel).toBe(0);
    expect(state.ui.showLevelComplete).toBe(false);
    expect(state.recipe.id).toBe(2);
  });
});
