import { combineReducers } from 'redux-immutable';

import list from './list';
import modal from './modal';
import file from './file';
import viewTaskItem from './viewTaskItem';

export default combineReducers({
  list,
  modal,
  file,
  viewTaskItem,
});
