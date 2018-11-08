import { combineReducers } from 'redux-immutable';

import auth from './auth';
import messages from './messages';
import printers from './printers';

export default combineReducers({
  auth,
  messages,
  printers,
});
