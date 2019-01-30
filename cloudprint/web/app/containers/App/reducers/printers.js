import { fromJS } from 'immutable';

import {
  REQUEST_PRINTERS,
  RECEIVE_PRINTERS,
  ERROR_PRINTERS,
  SET_PRINTERS_CURRENT,
  REQUEST_PRINTERS_ITEM,
  RECEIVE_PRINTERS_ITEM,
  ERROR_PRINTERS_ITEM,
} from '../constants/PrintersTypes';

const initialState = fromJS({
  // 获取打印机列表数据
  isFetching: false,
  data: false,
  error: false,

  // 当前选择的打印机 (sync 同步)
  current: false,

  // 获取当前 选择打印机 的 详情信息 (async 异步)
  itemFetching: false,
  item: false,
  itemError: false,
});

export default function printers(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PRINTERS:
      return state
        .set('isFetching', true)
        .set('error', false)
        .set('data', false);

    case RECEIVE_PRINTERS:
      return state.set('isFetching', false).set('data', action.value);

    case ERROR_PRINTERS:
      return state.set('isFetching', false).set('error', action.value);

    case SET_PRINTERS_CURRENT:
      return state.set('current', action.value);

    // PRINTERS_ITEM
    case REQUEST_PRINTERS_ITEM:
      return state
        .set('itemFetching', true)
        .set('itemError', false)
        .set('item', false);

    case RECEIVE_PRINTERS_ITEM:
      return state.set('itemFetching', false).set('item', action.value);

    case ERROR_PRINTERS_ITEM:
      return state.set('itemFetching', false).set('itemError', action.value);

    default:
      return state;
  }
}
