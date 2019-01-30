import {
  SET_VIEW_TASK_ITEM_TARGET,
  RECEIVE_VIEW_TASK_ITEM_DETAIL,
  SET_VIEW_TASK_ITEM_PAGE,
} from '../constants/ViewTaskItemTypes';

export const setViewTaskItemTarget = value => ({
  type: SET_VIEW_TASK_ITEM_TARGET,
  value,
});

export const receiveViewTaskItemDetail = json => ({
  type: RECEIVE_VIEW_TASK_ITEM_DETAIL,
  value: json.data,
});

export const setViewTaskItemPage = value => ({
  type: SET_VIEW_TASK_ITEM_PAGE,
  value: parseInt(value, 10),
});
