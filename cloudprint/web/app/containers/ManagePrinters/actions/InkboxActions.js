import { RECEIVE_INKBOX, ERROR_INKBOX } from './../constants/InkboxTypes';

export const receiveInkbox = json => ({
  type: RECEIVE_INKBOX,
  value: json.data,
});

export const errorInkbox = value => ({
  type: ERROR_INKBOX,
  value,
});
