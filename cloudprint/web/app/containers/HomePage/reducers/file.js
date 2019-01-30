import { fromJS } from 'immutable';
import {
  SET_FILE_DATA,
  SET_FILE_PROCESS,
  FILE_DRAGENTER,
  FILE_DRAGLEAVE,
  UPLOAD_FILE_COMPLETE,
  UPLOAD_FILE_ERROR,
} from '../constants/FileTypes';

import { INIT } from '../constants/InitTypes';

const initialState = fromJS({
  data: false,
  process: 0,
  dragEnter: false,
});

export default function list(state = initialState, action) {
  switch (action.type) {
    case SET_FILE_DATA:
      return state.set('data', action.value).set('dragEnter', false);

    case SET_FILE_PROCESS:
      return state.set('process', action.value);

    case FILE_DRAGENTER:
      return state.set('dragEnter', true);

    case FILE_DRAGLEAVE:
      return state.set('dragEnter', false);

    case INIT:
    case UPLOAD_FILE_COMPLETE:
    case UPLOAD_FILE_ERROR:
      return initialState;

    default:
      return state;
  }
}
