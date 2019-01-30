import { combineReducers } from 'redux-immutable';

import tasks from './tasks';
import modal from './modal';

export default combineReducers({
  tasks,
  modal,
});
