import { fromJS } from 'immutable';

import { INIT } from './../constants/InitTypes';

import { REQUEST_TASK_FILE, RECEIVE_TASK_FILE } from './../constants/TaskTypes';

const initialState = fromJS({
  isFetching: false,
});

export default function file(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return initialState;

    case REQUEST_TASK_FILE:
      return state.set('isFetching', true);

    case RECEIVE_TASK_FILE:
      return state.set('isFetching', false);

    default:
      return state;
  }
}
