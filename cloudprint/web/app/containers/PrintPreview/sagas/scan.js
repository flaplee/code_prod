import { select, call, put, takeLatest } from 'redux-saga/effects';

/* eslint-disable-next-line */
import delay from '@redux-saga/delay-p';

import { push } from 'connected-react-router/immutable';
import { authRequest } from 'utils/request';
import apis from 'containers/PrintPreview/apis';

import verifyForm from 'containers/PrintPreview/verifyForm';

import { addMessages } from 'containers/App/actions/MessagesActions';

import { SCAN_SUBMIT_TASK, RECEIVE_TASK } from '../constants/TaskTypes';

import { makeSelectForm } from '../selectors/form';

function* scanSubmit() {
  try {
    const data = yield select(makeSelectForm());

    verifyForm(data); // verify form

    const { fileList } = data;

    const method = 'post';

    const options = {
      method,
      data: JSON.stringify({ taskSource: 'WEB', fileList: [fileList] }),
    };

    const json = yield call(authRequest, apis.scanApply, options);
    yield delay(1500);
    const { code, msg } = json || { code: -1, msg: '打印失败' };
    if (code !== 0) throw msg;
    yield put({ type: RECEIVE_TASK });
    const success = { type: 'success', text: '扫码打印任务已创建成功' };
    yield put(addMessages(success));
    yield put(push('/'));
  } catch (e) {
    yield put({ type: RECEIVE_TASK });
    if (typeof e === 'string') {
      const error = { type: 'error', text: e };
      yield put(addMessages(error));
    }
  }
}

export default function* scan() {
  yield takeLatest(SCAN_SUBMIT_TASK, scanSubmit);
}
