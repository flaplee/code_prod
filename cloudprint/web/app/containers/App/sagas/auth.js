import { configureScope } from '@sentry/browser';

import { takeLatest } from 'redux-saga/effects';

import docCookies from 'utils/docCookies';

import { TOKEN, USER_ID, ORG_ID } from 'constants/cookies';

import { RECEIVE_AUTH } from '../constants/AuthTypes';

export function* receiveAuth() {
  const user_id = docCookies.getItem(USER_ID); // eslint-disable-line camelcase
  const org_id = docCookies.getItem(ORG_ID); // eslint-disable-line camelcase
  const appToken = docCookies.getItem(TOKEN);

  /* sentry configureScope setUser */
  configureScope(scope => {
    scope.setUser({
      user_id,
      org_id,
      appToken,
    });
  });
  /** END */
}

export default function* auth() {
  yield takeLatest(RECEIVE_AUTH, receiveAuth);
}
