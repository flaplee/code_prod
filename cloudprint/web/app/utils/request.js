/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
import { captureException } from '@sentry/browser';

import axios from 'axios';

import { TOKEN } from 'constants/cookies';

import docCookies from './docCookies';

import { checkJson } from './requestHelpers';
export { checkJson };

const timeout = 1000 * 30;

const getData = response => response.data;

// Global axios defaults
axios.defaults.headers.common.Pragma = 'no-cache';

const request = (url, options) => {
  const baseOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout,
    ...options,
  };
  return axios(url, baseOptions)
    .then(getData)
    .catch(e => {
      captureException(e);
      throw e;
    });
};

export const authRequest = (url, options) => {
  const authOptions = {
    headers: {
      'Content-Type': 'application/json',
      MP_TOKEN: docCookies.getItem(TOKEN),
    },
    timeout,
    ...options,
  };
  return axios(url, authOptions)
    .then(getData)
    .catch(e => {
      captureException(e);
      throw e;
    });
};

export default request;
