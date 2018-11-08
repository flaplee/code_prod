import { call, put, takeLatest } from 'redux-saga/effects';

import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/App/apis';

import {
  receivePrinters,
  setPrintersCurrent,
  loadPrintersError,
} from 'containers/App/actions/PrintersActions';

import { REQUEST_PRINTERS } from 'containers/App/constants/PrintersTypes';

import { REQUEST_TASKS } from './../constants/TasksTypes';

import { REQUEST_INKBOX } from './../constants/InkboxTypes';

function* loadPrinters() {
  try {
    const pageNo = 1;
    const pageSize = 12;

    const params = {
      pageNo,
      pageSize,
    };

    const options = {
      params,
    };

    const json = yield call(authRequest, apis.printer, options);
    checkJson(json);
    const data = (json && json.data) || false;
    const { rows } = data || { rows: [] };
    const emptyRows = '未添加打印机，请先为组织添加设备';
    if (rows.length === 0) throw emptyRows;
    yield put(receivePrinters(json));
    yield put(setPrintersCurrent(rows[0]));
    yield put({ type: REQUEST_INKBOX });
    yield put({ type: REQUEST_TASKS });
  } catch (e) {
    yield put(loadPrintersError(e));
    /* eslint-disable-next-line */
    console.log(e);
  }
}

export default function* printers() {
  yield takeLatest(REQUEST_PRINTERS, loadPrinters);
}
