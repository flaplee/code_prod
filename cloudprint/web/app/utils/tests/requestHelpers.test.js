import { defaultMessage, checkJson } from '../requestHelpers';

describe('checkJson detecte error', () => {
  test('json code is 0, should not toThrow', () => {
    const json = { code: 0 };
    expect(() => checkJson(json)).not.toThrow();
  });

  test('json is wrong', () => {
    const custom = 'custom msg';
    expect(() => checkJson({})).toThrow(defaultMessage);
    expect(() => checkJson({}, custom)).toThrow(custom);

    expect(() => checkJson()).toThrow(defaultMessage);
    expect(() => checkJson(undefined, custom)).toThrow(custom);

    expect(() => checkJson([])).toThrow(defaultMessage);
    expect(() => checkJson([], custom)).toThrow(custom);
  });

  test('json code is not 0, no msg, if custom do not exist should throw defaultMessage, if custom exist should throw custom', () => {
    const custom = 'custom msg';
    const json = { code: -1 };
    expect(() => checkJson(json)).toThrow(defaultMessage);
    expect(() => checkJson(json, custom)).toThrow(custom);
  });

  test('json code is not 0, respond msg, if custom do not exist should throw respond msg, if custom exist should throw custom', () => {
    const custom = 'custom msg';
    const json = { code: -1, msg: 'respond error msg' };
    expect(() => checkJson(json)).toThrow(json.msg);
    expect(() => checkJson(json, custom)).toThrow(json.msg);
  });

  test('json code is not 0, respond msg is meaningless(is not string or empty string), if custom do not exist should throw defaultMessage, if custom exist should throw custom', () => {
    const custom = 'custom msg';
    const json1 = { code: -1, msg: '' };
    expect(() => checkJson(json1)).toThrow(defaultMessage);
    expect(() => checkJson(json1, custom)).toThrow(custom);

    const json2 = { code: -1, msg: { bala: 'balabala' } };
    expect(() => checkJson(json2)).toThrow(defaultMessage);
    expect(() => checkJson(json2, custom)).toThrow(custom);

    const json3 = { code: -1, msg: null };
    expect(() => checkJson(json3)).toThrow(defaultMessage);
    expect(() => checkJson(json3, custom)).toThrow(custom);
  });
});
