/* eslint-disable */
import { put, select, takeLatest, cancel } from 'redux-saga/effects';

import delay from '@redux-saga/delay-p';

import { ADD_MESSAGES, CLEAR_MESSAGES } from './../constants/MessagesTypes';

import { makeSelectMessages } from './../selectors/messages';

export function* clearMessages() {
  // while (true) {
  //   try {
  //     yield delay(3000);
  //     const currentMsgs = yield select(makeSelectMessages());
  //     if (currentMsgs.length > 0) {
  //       yield put({ type: CLEAR_MESSAGES });
  //     } else {
  //       yield cancel();
  //     }
  //   } catch (e) {
  //     yield cancel();
  //   }
  // }
}

export default function* messages() {
  // yield takeLatest(ADD_MESSAGES, clearMessages);
}
