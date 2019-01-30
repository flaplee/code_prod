import { fromJS } from 'immutable';

import { INIT } from '../constants/InitTypes';

import {
  REQUEST_TASK_FILE,
  RECEIVE_TASK_FILE,
  SET_FILE_TRANSTIPDIR,
} from '../constants/TaskTypes';

const initialState = fromJS({
  isFetching: false,
  transTipDir: '',
});

export default function file(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return initialState;

    case REQUEST_TASK_FILE:
      return state.set('isFetching', true);

    case RECEIVE_TASK_FILE:
      return state.set('isFetching', false);

    case SET_FILE_TRANSTIPDIR:
      return state.set('transTipDir', action.value);

    default:
      return state;
  }
}
