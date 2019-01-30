/* eslint-disable */
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/HomePage/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import {
  REQUEST_CANCEL_TASK_ITEM,
  CLOSE_MODAL,
} from './../constants/ModalTypes';

import { REQUEST_TASKS } from './../constants/TasksTypes';

import { makeSelectModal } from './../selectors/modal';

function* cancelTask() {
  try {
    const modal = yield select(makeSelectModal());
    const { taskCode } = modal.target;

    const json = yield call(authRequest, `${apis.cancelTask}/${taskCode}`);
    checkJson(json, '取消任务失败');
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_TASKS });
    const success = { type: 'success', text: '取消任务成功' };
    yield put(addMessages(success));
  } catch (e) {
    yield put({ type: CLOSE_MODAL });
    const text = typeof e === 'string' ? e : '取消任务失败';
    const error = { type: 'warning', text };
    yield put(addMessages(error));
  }
}

export default function* handleTask() {
  yield takeLatest(REQUEST_CANCEL_TASK_ITEM, cancelTask);
}
