import { select, call, put, takeLatest } from 'redux-saga/effects';
/* eslint-disable-next-line */
import delay from '@redux-saga/delay-p';
import { authRequest } from 'utils/request';
import apis from 'containers/HomePage/apis';

import PAGE_SIZE from 'containers/HomePage/pageSize';

import { REQUEST_VIEW_TASK_ITEM_DETAIL } from '../constants/ViewTaskItemTypes';

import {
  makeSelectViewTaskItemTarget,
  makeSelectViewTaskItemPage,
} from '../selectors/viewTaskItem';

import { receiveViewTaskItemDetail } from '../actions/ViewTaskItemActions';

function* fetchViewTaskItem() {
  try {
    const method = 'post';
    const target = yield select(makeSelectViewTaskItemTarget());
    const { printerSn } = target;
    const pageNo = yield select(makeSelectViewTaskItemPage());
    const pageSize = PAGE_SIZE.viewTaskItem;
    const params = {
      printerSn,
      pageNo,
      pageSize,
    };
    const options = {
      method,
      params,
    };
    const json = yield call(authRequest, apis.taskDetail, options);
    yield put(receiveViewTaskItemDetail(json));
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
  }
}

export default function* viewTaskItem() {
  yield takeLatest(REQUEST_VIEW_TASK_ITEM_DETAIL, fetchViewTaskItem);
}
