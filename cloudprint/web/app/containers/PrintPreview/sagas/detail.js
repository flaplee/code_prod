/**
 * 仅重新打印才执行以下
 */

/* eslint-disable */
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest } from 'utils/request';
/* eslint-disable-next-line */
import delay from '@redux-saga/delay-p';
import apis from 'containers/PrintPreview/apis';

import { addForm } from './../actions/FormActions';

import {
  REQUEST_TASK_DETAIL,
  RECEIVE_TASK_DETAIL,
} from './../constants/TaskTypes';

import { makeSelectSearch } from './../selectors/search';

function* fetchDetail() {
  try {
    const search = yield select(makeSelectSearch());
    const { taskCode } = search || {};
    const json = yield call(
      authRequest,
      `${apis.printerTaskDetail}/${taskCode}`,
    );
    const { code, msg } = json || { code: -1, msg: '获取数据失败' };
    if (code !== 0) throw msg;
    const fileList = json.data.fileList[0];
    // 重新打印 初始化表单信息
    yield put(
      addForm({
        printEndPage: fileList.totalPage,
        fileList,
      }),
    );

    yield put({ type: RECEIVE_TASK_DETAIL });
  } catch (e) {
    /* eslint-disable-next-line */
    console.log(e);
  }
}

export default function* detail() {
  yield takeLatest(REQUEST_TASK_DETAIL, fetchDetail);
}
