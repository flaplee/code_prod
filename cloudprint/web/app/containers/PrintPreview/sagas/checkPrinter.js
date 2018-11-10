import { put, select, takeLatest, call } from 'redux-saga/effects';

import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/App/apis';

/* eslint-disable-next-line */
import delay from '@redux-saga/delay-p';

import { REQUEST_PRINTERS_ITEM } from 'containers/App/constants/PrintersTypes';

import { makeSelectAppPrintersCurrent } from 'containers/App/selectors/printers';

import { receivePrinterItem } from 'containers/App/actions/PrintersActions';

function* checkPrinter() {
  try {
    const printersCurrent = yield select(makeSelectAppPrintersCurrent());
    const { printerSn } = printersCurrent || { printerSn: false };
    const msg = '暂未找到相关打印机';
    if (!printerSn) throw msg;
    const json = yield call(authRequest, `${apis.printerStatus}/${printerSn}`);
    const checkMsg = '暂未检测到打印机状态';
    checkJson(json, checkMsg);
    const data = (json && json.data) || false;
    if (data === false) throw checkMsg;
    yield put(receivePrinterItem(json));
  } catch (e) {
    /* eslint-disable-next-line */
  }
}

export default function* check() {
  yield takeLatest(REQUEST_PRINTERS_ITEM, checkPrinter);
}
