import { put, call, select, takeLatest } from 'redux-saga/effects';
import { authRequest } from 'utils/request';

import { makeSelectAppPrintersCurrent } from 'containers/App/selectors/printers';

import PAGE_SIZE from 'containers/ManagePrinters/pageSize';

/* eslint-disable-next-line no-unused-vars */
import delay from '@redux-saga/delay-p';

import apis from 'containers/ManagePrinters/apis';
import { REQUEST_TASKS, TASKS_ERROR } from './../constants/TasksTypes';

import { makeSelectTasksPage } from './../selectors/tasks';

import { receiveTasks } from './../actions/TasksActions';

function* fetchTasks() {
  try {
    const method = 'post';
    const currentPrinter = yield select(makeSelectAppPrintersCurrent());
    const msg = '暂无数据';
    if (currentPrinter === false) throw msg;

    const { printerSn } = currentPrinter;
    const pageNo = yield select(makeSelectTasksPage());
    const pageSize = PAGE_SIZE.tasks;
    const params = {
      printerSn,
      pageNo,
      pageSize,
    };
    const options = {
      method,
      params,
    };
    const json = yield call(authRequest, apis.printerTask, options);
    const rows = (json && json.data && json.data.rows) || false;
    if (rows === false) throw msg;
    yield put(receiveTasks(json));
  } catch (e) {
    yield put({ type: TASKS_ERROR });
  }
}

export default function* tasks() {
  yield takeLatest(REQUEST_TASKS, fetchTasks);
}
