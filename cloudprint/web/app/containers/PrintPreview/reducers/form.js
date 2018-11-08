/**
 * 参数
 */
import { fromJS } from 'immutable';

import { INIT } from './../constants/InitTypes';

import { SET_FORM, ADD_FORM } from './../constants/FormTypes';

const initialState = fromJS({
  taskSource: 'WEB',
  printerSn: '',
  printDirection: 1,
  printStartPage: 1,
  printEndPage: 1,
  paperSize: 'A4',
  printColorMode: 'black',
  printWhole: 0,
  duplexMode: 1,
  copyCount: 1,
  printDpi: 600, // 300 600 1200
  fileList: {
    fileSource: '',
    fileName: '',
    fileSuffix: '',
    printPDF: false,
    printUrl: '',
    printMd5: '',
    totalPage: 1,
    fileId: '',
  },
});

export default function form(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return initialState;

    case SET_FORM:
      return state.setIn(action.key, action.value);

    case ADD_FORM:
      return state.merge(action.value);

    default:
      return state;
  }
}
