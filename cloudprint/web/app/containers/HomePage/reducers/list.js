import { fromJS } from 'immutable';
import {
  REQUEST_LIST,
  RECEIVE_LIST,
  SET_LIST_PAGE,
  ERROR_LIST,
} from '../constants/ListTypes';

import { INIT } from '../constants/InitTypes';

const initialState = fromJS({
  isFetching: false,
  data: false,
  page: 1,
  error: false,
});

export default function list(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return initialState;

    case REQUEST_LIST:
      return state.set('isFetching', true).set('error', false);

    case RECEIVE_LIST:
      return state.set('isFetching', false).set('data', action.value);

    case SET_LIST_PAGE:
      return state.set('page', action.value);

    case ERROR_LIST:
      return state.set('error', action.value).set('isFetching', false);

    default:
      return state;
  }
}
