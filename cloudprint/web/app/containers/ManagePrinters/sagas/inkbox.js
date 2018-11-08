import { select, call, put, takeLatest } from 'redux-saga/effects';
import { authRequest } from 'utils/request';

/* eslint-disable-next-line no-unused-vars */
import delay from '@redux-saga/delay-p';

import apis from 'containers/ManagePrinters/apis';

import { makeSelectAppPrintersCurrent } from 'containers/App/selectors/printers';

import { REQUEST_INKBOX } from './../constants/InkboxTypes';

import { receiveInkbox, errorInkbox } from './../actions/InkboxActions';

function* fetchInkbox() {
  try {
    yield delay(1000);
    const currentPrinter = yield select(makeSelectAppPrintersCurrent());
    const { inkboxSn } = currentPrinter;
    const json = yield call(authRequest, `${apis.inkbox}/${inkboxSn}`);
    const { code, msg } = json;
    if (code !== 0) throw msg;
    yield put(receiveInkbox(json));
  } catch (e) {
    if (typeof e === 'string') {
      yield put(errorInkbox(e));
    }
  }
}

export default function* inkbox() {
  yield takeLatest(REQUEST_INKBOX, fetchInkbox);
}
