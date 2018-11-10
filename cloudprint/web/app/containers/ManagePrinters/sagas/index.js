import { all } from 'redux-saga/effects';

import printers from './printers';
import inkbox from './inkbox';
import tasks from './tasks';
import handleTask from './handleTask';

export default function* rootSaga() {
  yield all([printers(), inkbox(), tasks(), handleTask()]);
}
