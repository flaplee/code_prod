import { fromJS } from 'immutable';

import {
  REQUEST_PRINTERS,
  RECEIVE_PRINTERS,
  ERROR_PRINTERS,
  SET_PRINTERS_CURRENT,
  REQUEST_PRINTERS_ITEM,
  RECEIVE_PRINTERS_ITEM,
} from './../constants/PrintersTypes';

const initialState = fromJS({
  isFetching: false,
  data: false,
  error: false,

  current: false,

  itemFetching: false,
  item: false,
});

export default function printers(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PRINTERS:
      return state.set('isFetching', true).set('error', false);

    case RECEIVE_PRINTERS:
      return state.set('isFetching', false).set('data', action.value);

    case ERROR_PRINTERS:
      return state.set('isFetching', false).set('error', action.value);

    case SET_PRINTERS_CURRENT:
      return state.set('current', action.value);

    case REQUEST_PRINTERS_ITEM:
      return state.set('itemFetching', true);

    case RECEIVE_PRINTERS_ITEM:
      return state.set('item', action.value).set('itemFetching', false);

    default:
      return state;
  }
}
