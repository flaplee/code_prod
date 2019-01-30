import { fromJS } from 'immutable';

import { INIT } from '../constants/InitTypes';

import {
  REQUEST_TASK_DETAIL,
  RECEIVE_TASK_DETAIL,
} from '../constants/TaskTypes';

const initialState = fromJS({
  isFetching: false,
});

export default function detail(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return initialState;

    case REQUEST_TASK_DETAIL:
      return state.set('isFetching', true);

    case RECEIVE_TASK_DETAIL:
      return state.set('isFetching', false);

    default:
      return state;
  }
}
