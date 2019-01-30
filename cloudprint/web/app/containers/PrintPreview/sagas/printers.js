import { call, put, takeLatest } from 'redux-saga/effects';

import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/App/apis';

import {
  receivePrinters,
  setPrintersCurrent,
  errorPrintersItem,
  loadPrintersError,
} from 'containers/App/actions/PrintersActions';

import {
  REQUEST_PRINTERS,
  REQUEST_PRINTERS_ITEM,
} from 'containers/App/constants/PrintersTypes';

import { setForm } from '../actions/FormActions';

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
    yield put(setForm({ key: ['printerSn'], value: rows[0].printerSn }));

    // 接收数据后 初始化 打印颜色, 如果存在cmyk 设置为 cmyk
    const { colorTypes } = rows[0] && rows[0].printerSettings;
    const color = colorTypes.indexOf('cmyk') !== -1 ? 'cmyk' : 'black';
    yield put(setForm({ key: ['printColorMode'], value: color }));

    yield put({ type: REQUEST_PRINTERS_ITEM });
  } catch (e) {
    const eAsStr = typeof e === 'string' ? e : '获取数据失败';
    yield put(loadPrintersError(eAsStr));
    yield put(errorPrintersItem(eAsStr));
  }
}

export default function* printers() {
  yield takeLatest(REQUEST_PRINTERS, loadPrinters);
}
