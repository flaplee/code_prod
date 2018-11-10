import axios from 'axios';
import request, { authRequest } from './../request';

jest.mock('axios');

describe('request', () => {
  test('request should fetch data', () => {
    const resp = { data: 'hello' };
    axios.mockResolvedValue(resp);

    return request('/api').then(data => expect(data).toEqual('hello'));
  });

  test('authRequest should fetch data', () => {
    const resp = { data: 'hello' };
    axios.mockResolvedValue(resp);

    return authRequest('/api').then(data => expect(data).toEqual('hello'));
  });
});
