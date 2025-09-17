export {}; // Make this a module

describe('Population Math', () => {
  test('delta = survived * eggsPerClutch', () => {
    const selected = [0, 1, 2];
    const outcomes = ['fruit', 'barren', 'fruit', 'barren', 'fruit'] as const;
    const survived = selected.filter((i) => outcomes[i] === 'fruit').length; // 2
    const eggs = 3;
    expect(survived * eggs).toBe(6);
  });

  test('no survival means no population growth', () => {
    const selected = [0, 1, 2];
    const outcomes = ['barren', 'barren', 'barren', 'fruit', 'fruit'] as const;
    const survived = selected.filter((i) => outcomes[i] === 'fruit').length; // 0
    const eggs = 3;
    expect(survived * eggs).toBe(0);
  });

  test('all survival means maximum growth', () => {
    const selected = [0, 1, 2];
    const outcomes = ['fruit', 'fruit', 'fruit', 'barren', 'barren'] as const;
    const survived = selected.filter((i) => outcomes[i] === 'fruit').length; // 3
    const eggs = 3;
    expect(survived * eggs).toBe(9);
  });

  test('different eggs per clutch affects growth', () => {
    const selected = [0, 1];
    const outcomes = ['fruit', 'fruit', 'barren', 'barren', 'barren'] as const;
    const survived = selected.filter((i) => outcomes[i] === 'fruit').length; // 2

    expect(survived * 3).toBe(6); // 3 eggs per clutch
    expect(survived * 5).toBe(10); // 5 eggs per clutch
  });
});
