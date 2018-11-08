import { combineReducers } from 'redux-immutable';

import inkbox from './inkbox';
import tasks from './tasks';
import modal from './modal';

export default combineReducers({
  inkbox,
  tasks,
  modal,
});
