import { all } from 'redux-saga/effects';

import file from './file';
import list from './list';
import handleTask from './handleTask';
import handleTaskItem from './handleTaskItem';
import viewTaskItem from './viewTaskItem';

export default function* rootSaga() {
  yield all([file(), list(), handleTask(), handleTaskItem(), viewTaskItem()]);
}
