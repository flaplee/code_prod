import returnFileSize from '../returnFileSize';

describe('returnFileSize', () => {
  test('bytes', () => {
    expect(returnFileSize(600)).toBe('600bytes');
  });
  test('KB', () => {
    expect(returnFileSize(1600)).toBe('1.6KB');
  });
  test('MB', () => {
    expect(returnFileSize(30700000)).toBe('29.3MB');
  });
});
