import {
  RECEIVE_LIST,
  SET_LIST_PAGE,
  ERROR_LIST,
} from '../constants/ListTypes';

export const receiveList = json => ({
  type: RECEIVE_LIST,
  value: json.data,
});

export const setListPage = value => ({
  type: SET_LIST_PAGE,
  value: parseInt(value, 10),
});

export const errorList = value => ({
  type: ERROR_LIST,
  value,
});
