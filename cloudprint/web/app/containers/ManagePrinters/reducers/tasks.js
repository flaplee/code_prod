import { fromJS } from 'immutable';

import {
  REQUEST_TASKS,
  RECEIVE_TASKS,
  TASKS_ERROR,
  SET_TASKS_PAGE,
} from '../constants/TasksTypes';

const initialState = fromJS({
  data: false,
  isFetching: false,
  page: 1,
});

export default function list(state = initialState, action) {
  switch (action.type) {
    case TASKS_ERROR:
      return initialState;

    case REQUEST_TASKS:
      return state.set('isFetching', true);

    case RECEIVE_TASKS:
      return state.set('data', action.value).set('isFetching', false);

    case SET_TASKS_PAGE:
      return state.set('page', action.value);

    default:
      return state;
  }
}
