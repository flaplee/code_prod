import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/HomePage/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import {
  CLOSE_MODAL,
  REQUEST_CANCEL_TASK,
  REQUEST_DELETE_TASK,
} from './../constants/ModalTypes';

import { REQUEST_LIST } from './../constants/ListTypes';

import { makeSelectModal } from './../selectors/modal';

function* cancelTask() {
  try {
    const modal = yield select(makeSelectModal());
    const { taskCode } = modal.target;

    const json = yield call(authRequest, `${apis.cancelTask}/${taskCode}`);
    checkJson(json, '取消失败');
    const success = { type: 'info', text: '已取消打印' };
    yield put(addMessages(success));
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_LIST });
  } catch (e) {
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_LIST });
    const text = typeof e === 'string' ? e : '取消失败';
    const error = { type: 'warning', text };
    yield put(addMessages(error));
  }
}

function* deleteTask() {
  try {
    const method = 'post';
    const modal = yield select(makeSelectModal());
    const { id } = modal.target;
    const params = {
      id,
    };
    const options = {
      method,
      params,
    };
    const json = yield call(authRequest, apis.deleteTask, options);
    checkJson(json, '删除失败');
    const success = { type: 'info', text: '已删除打印' };
    yield put(addMessages(success));
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_LIST });
  } catch (e) {
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_LIST });
    const text = typeof e === 'string' && e !== '' ? e : '删除失败';
    const error = { type: 'warning', text };
    yield put(addMessages(error));
  }
}

export default function* handleTask() {
  yield takeLatest(REQUEST_CANCEL_TASK, cancelTask);
  yield takeLatest(REQUEST_DELETE_TASK, deleteTask);
}
