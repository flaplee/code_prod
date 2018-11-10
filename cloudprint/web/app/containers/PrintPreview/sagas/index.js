import { all } from 'redux-saga/effects';

import form from './form';
import scan from './scan';
import printers from './printers';
import checkPrinter from './checkPrinter';
import task from './task';
import file from './file';
import detail from './detail';

export default function* rootSaga() {
  yield all([
    form(),
    scan(),
    printers(),
    checkPrinter(),
    task(),
    file(),
    detail(),
  ]);
}
