import { fromJS } from 'immutable';

import {
  REQUEST_INKBOX,
  RECEIVE_INKBOX,
  ERROR_INKBOX,
} from './../constants/InkboxTypes';

const initialState = fromJS({
  data: false,
  isFetching: false,
  error: false,
});

export default function inkbox(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INKBOX:
      return state
        .set('isFetching', true)
        .set('error', false)
        .set('data', false);

    case RECEIVE_INKBOX:
      return state
        .set('isFetching', false)
        .set('error', false)
        .set('data', action.value);

    case ERROR_INKBOX:
      return state
        .set('error', action.value)
        .set('data', false)
        .set('isFetching', false);

    default:
      return state;
  }
}
