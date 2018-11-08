import { fromJS } from 'immutable';

import {
  TOGGLE_VIEW_TASK_ITEM,
  SET_VIEW_TASK_ITEM_TARGET,
  REQUEST_VIEW_TASK_ITEM_DETAIL,
  RECEIVE_VIEW_TASK_ITEM_DETAIL,
  SET_VIEW_TASK_ITEM_PAGE,
} from './../constants/ViewTaskItemTypes';

const initialState = fromJS({
  show: false,
  detail: false,
  page: 1,
  isFetching: false,
  target: false,
});

export default function list(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_VIEW_TASK_ITEM:
      return state.update('show', value => !value);

    case SET_VIEW_TASK_ITEM_TARGET:
      return state.set('target', action.value);

    case REQUEST_VIEW_TASK_ITEM_DETAIL:
      return state.set('isFetching', true);

    case RECEIVE_VIEW_TASK_ITEM_DETAIL:
      return state.set('detail', action.value).set('isFetching', false);

    case SET_VIEW_TASK_ITEM_PAGE:
      return state.set('page', action.value);

    default:
      return state;
  }
}
