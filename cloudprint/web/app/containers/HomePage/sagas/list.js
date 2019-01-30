import { select, call, put, takeLatest } from 'redux-saga/effects';
import delay from '@redux-saga/delay-p';
import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/HomePage/apis';
import PAGE_SIZE from 'containers/HomePage/pageSize';

import { REQUEST_LIST } from '../constants/ListTypes';
import { receiveList, errorList } from '../actions/ListActions';

import { selectListPage } from '../selectors/list';

function* fetchList() {
  try {
    const pageNo = yield select(selectListPage());
    const pageSize = PAGE_SIZE.myPrintTasks;
    const params = {
      pageNo,
      pageSize,
    };
    const options = {
      params,
    };
    const json = yield call(authRequest, apis.printerTask, options);
    yield delay(1500);
    checkJson(json, '获取列表失败');
    yield put(receiveList(json));
  } catch (e) {
    const error = typeof e === 'string' ? e : '获取列表失败';
    yield put(errorList(error));
  }
}

export default function* list() {
  yield takeLatest(REQUEST_LIST, fetchList);
}
