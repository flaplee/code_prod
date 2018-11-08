import { combineReducers } from 'redux-immutable';

import search from './search';
import form from './form';
import file from './file';
import detail from './detail';
import task from './task';

export default combineReducers({
  search,
  form,
  file,
  detail,
  task,
});
