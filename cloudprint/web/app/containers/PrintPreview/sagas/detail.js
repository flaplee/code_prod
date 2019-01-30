/**
 * 仅重新打印才执行以下
 */
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest, checkJson } from 'utils/request';
/* eslint-disable-next-line */
import delay from '@redux-saga/delay-p';
import apis from 'containers/PrintPreview/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import { addForm } from '../actions/FormActions';

import {
  REQUEST_TASK_DETAIL,
  RECEIVE_TASK_DETAIL,
} from '../constants/TaskTypes';

import { makeSelectSearch } from '../selectors/search';

function* fetchDetail() {
  try {
    const search = yield select(makeSelectSearch());
    const { taskCode } = search || {};
    const json = yield call(
      authRequest,
      `${apis.printerTaskDetail}/${taskCode}`,
    );
    checkJson(json);
    const { whetherAgainPrint, tips } = json.data;

    if (whetherAgainPrint !== true) throw tips;

    const fileList = json.data.fileList[0];
    // 重新打印 初始化表单信息

    const { fileId, fileName } = fileList;

    // 临时处理后端未完善的数据
    const stringReg = `^${fileId}_`;
    const reg = new RegExp(stringReg);

    yield put(
      addForm({
        fileList: {
          ...fileList,
          fileName: fileName.replace(reg, ''),
        },
      }),
    );

    yield put({ type: RECEIVE_TASK_DETAIL });
  } catch (e) {
    const error = {
      type: 'error',
      text: typeof e === 'string' ? e : '文件转换失败',
    };
    yield put(addMessages(error));
  }
}

export default function* detail() {
  yield takeLatest(REQUEST_TASK_DETAIL, fetchDetail);
}
