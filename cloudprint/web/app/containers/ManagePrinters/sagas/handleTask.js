/* eslint-disable */
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest } from 'utils/request';
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
    const { code, msg } = json || { code: -1, msg: '取消失败' };
    if (code !== 0) throw msg;
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_TASKS });
    const success = { type: 'success', text: '取消成功' };
    yield put(addMessages(success));
  } catch (e) {
    yield put({ type: CLOSE_MODAL });
    if (typeof e === 'string') {
      const error = { type: 'warning', text: e };
      yield put(addMessages(error));
    }
  }
}

export default function* handleTask() {
  yield takeLatest(REQUEST_CANCEL_TASK_ITEM, cancelTask);
}
