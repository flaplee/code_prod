import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/HomePage/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import { CLOSE_MODAL, REQUEST_CANCEL_TASK_ITEM } from '../constants/ModalTypes';

import { REQUEST_VIEW_TASK_ITEM_DETAIL } from '../constants/ViewTaskItemTypes';

import { makeSelectModal } from '../selectors/modal';

function* cancelTaskItem() {
  try {
    const modal = yield select(makeSelectModal());
    const { taskCode } = modal.target;

    const json = yield call(authRequest, `${apis.cancelTask}/${taskCode}`);
    checkJson(json, '取消任务失败');
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_VIEW_TASK_ITEM_DETAIL });
    const success = { type: 'success', text: '取消任务成功' };
    yield put(addMessages(success));
  } catch (e) {
    yield put({ type: CLOSE_MODAL });
    const text = typeof e === 'string' ? e : '取消任务失败';
    const error = { type: 'warning', text };
    yield put(addMessages(error));
  }
}

export default function* handleTaskItem() {
  yield takeLatest(REQUEST_CANCEL_TASK_ITEM, cancelTaskItem);
}
