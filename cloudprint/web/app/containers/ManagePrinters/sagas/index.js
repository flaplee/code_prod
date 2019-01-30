import { all } from 'redux-saga/effects';

import printers from './printers';
import checkPrinter from './checkPrinter';
import tasks from './tasks';
import handleTask from './handleTask';

export default function* rootSaga() {
  yield all([printers(), checkPrinter(), tasks(), handleTask()]);
}
