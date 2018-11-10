describe('ScrollToTop location.state.noScroll', () => {
  test('noScroll is false', () => {
    const location = {};
    const { noScroll } = location.state || { noScroll: false };
    expect(noScroll).not.toBe(true);
  });

  test('noScroll is false', () => {
    const location = { state: 'other' };
    const { noScroll } = location.state || { noScroll: false };
    expect(noScroll).not.toBe(true);
  });

  test('noScroll is false', () => {
    const location = { statdde: 'other' };
    const { noScroll } = location.state || { noScroll: false };
    expect(noScroll).not.toBe(true);
  });

  test('noScroll is false', () => {
    const location = { state: { noScroll: 'other' } };
    const { noScroll } = location.state || { noScroll: false };
    expect(noScroll).not.toBe(true);
  });

  test('noScroll is true', () => {
    const location = { state: { noScroll: true } };
    const { noScroll } = location.state || { noScroll: false };
    expect(noScroll).toBe(true);
  });
});
