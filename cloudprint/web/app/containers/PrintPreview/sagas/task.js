import { select, put, takeLatest } from 'redux-saga/effects';
/* eslint-disable-next-line */
import delay from '@redux-saga/delay-p';
/* eslint-disable-next-line */
import apis from 'containers/PrintPreview/apis';

import {
  REQUEST_TASK,
  REQUEST_TASK_FILE,
  REQUEST_TASK_DETAIL,
} from './../constants/TaskTypes';

import { makeSelectSearch } from './../selectors/search';

function* fetchTask() {
  try {
    const search = yield select(makeSelectSearch());
    const { restart } = search;
    if (restart === 'yes') {
      // 重新打印
      yield put({ type: REQUEST_TASK_DETAIL });
    } else {
      // 创建打印
      yield put({ type: REQUEST_TASK_FILE });
    }
  } catch (e) {
    /* eslint-disable-next-line */
    console.log(e);
  }
}

export default function* task() {
  yield takeLatest(REQUEST_TASK, fetchTask);
}
