import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest } from 'utils/request';
import apis from 'containers/HomePage/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import {
  CLOSE_MODAL,
  REQUEST_CANCEL_TASK_ITEM,
} from './../constants/ModalTypes';

import { REQUEST_VIEW_TASK_ITEM_DETAIL } from './../constants/ViewTaskItemTypes';

import { makeSelectModal } from './../selectors/modal';

function* cancelTaskItem() {
  try {
    const modal = yield select(makeSelectModal());
    const { taskCode } = modal.target;

    const json = yield call(authRequest, `${apis.cancelTask}/${taskCode}`);
    const { code, msg } = json || { code: -1, msg: '取消失败' };
    if (code !== 0) throw msg;
    yield put({ type: CLOSE_MODAL });
    yield put({ type: REQUEST_VIEW_TASK_ITEM_DETAIL });
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

export default function* handleTaskItem() {
  yield takeLatest(REQUEST_CANCEL_TASK_ITEM, cancelTaskItem);
}
