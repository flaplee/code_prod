import { all } from 'redux-saga/effects';

import messages from './messages';

export default function* rootSaga() {
  yield all([messages()]);
}
