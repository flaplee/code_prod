/**
 * 提交任务 与服务器交互的状态
 */
import { fromJS } from 'immutable';

import { INIT } from '../constants/InitTypes';

import {
  SUBMIT_TASK,
  SCAN_SUBMIT_TASK,
  RECEIVE_TASK,
} from '../constants/TaskTypes';

const initialState = fromJS({
  isFetching: false,
});

export default function task(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return initialState;

    case SUBMIT_TASK:
    case SCAN_SUBMIT_TASK:
      return state.set('isFetching', true);

    case RECEIVE_TASK:
      return state.set('isFetching', false);

    default:
      return state;
  }
}
