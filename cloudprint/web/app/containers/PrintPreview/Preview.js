import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersCurrent,
} from 'containers/App/selectors/printers';

import Preview from './components/Preview';

import { makeSelectFormItem } from './selectors/form';

import { makeSelectTaskIsFetching } from './selectors/task';

import { makeSelectSearch } from './selectors/search';

import { makeSelectFileIsFetching } from './selectors/file';
import { makeSelectDetailIsFetching } from './selectors/detail';

import { SUBMIT_TASK, SCAN_SUBMIT_TASK } from './constants/TaskTypes';

const mapStateToProps = createStructuredSelector({
  search: makeSelectSearch(),
  fileId: makeSelectFormItem(['fileList', 'fileId']),
  total: makeSelectFormItem(['fileList', 'totalPage']),

  fileIsFetching: makeSelectFileIsFetching(),
  detailIsFetching: makeSelectDetailIsFetching(),
  printerItemFetching: makeSelectAppPrintersItemFetching(),
  currentPrinter: makeSelectAppPrintersCurrent(),

  taskIsFetching: makeSelectTaskIsFetching(),

  paperSize: makeSelectFormItem(['paperSize']),
  printDirection: makeSelectFormItem(['printDirection']),
});

const mapDispatchToProps = dispatch => ({
  submit: () => {
    dispatch({ type: SUBMIT_TASK });
  },
  scanSubmit: () => {
    dispatch({ type: SCAN_SUBMIT_TASK });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preview);
