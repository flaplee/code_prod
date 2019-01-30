import { put, select, takeLatest, call } from 'redux-saga/effects';

import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/App/apis';

/* eslint-disable-next-line */
import delay from '@redux-saga/delay-p';

import { REQUEST_PRINTERS_ITEM } from 'containers/App/constants/PrintersTypes';

import { makeSelectAppPrintersCurrent } from 'containers/App/selectors/printers';

import {
  receivePrinterItem,
  errorPrintersItem,
} from 'containers/App/actions/PrintersActions';

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

    const { hasPermissions } = data;
    const notPermissions = '暂未检测到打印机状态';
    if (hasPermissions !== true) throw notPermissions;

    yield put(receivePrinterItem(json));
    yield put(errorPrintersItem(false));
  } catch (e) {
    const eAsStr = typeof e === 'string' ? e : '获取数据失败';
    yield put(errorPrintersItem(eAsStr));
  }
}

const DURING = 1000 * 10;

function* checkPrinterChannel() {
  while (true) {
    yield call(checkPrinter);
    yield delay(DURING);
  }
}

export default function* check() {
  yield takeLatest(
    REQUEST_PRINTERS_ITEM,
    process.env.NODE_ENV === 'development' ? checkPrinter : checkPrinterChannel,
  );
}
