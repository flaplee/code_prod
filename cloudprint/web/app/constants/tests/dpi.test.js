import dpi from '../dpi';

describe('array dpi key equal value', () => {
  test('dpi error', () => {
    let isEqual = true;
    Object.entries(dpi).forEach(([key, value]) => {
      if (key !== value.toString()) isEqual = false;
    });
    expect(isEqual).toBe(true);
  });
});
