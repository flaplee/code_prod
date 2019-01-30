import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersData,
  makeSelectAppPrintersCurrent,
} from 'containers/App/selectors/printers';

import {
  setPrintersCurrent,
  requestPrinterItem,
} from 'containers/App/actions/PrintersActions';

import Printer from './components/Printer';

import { REQUEST_TASKS } from './constants/TasksTypes';

const mapStateToProps = createStructuredSelector({
  loading: makeSelectAppPrintersIsFetching(),
  data: makeSelectAppPrintersData(),
  current: makeSelectAppPrintersCurrent(),
});

const mapDispatchToProps = dispatch => ({
  makeSelect: value => {
    dispatch(setPrintersCurrent(value));
    dispatch(requestPrinterItem());
    dispatch({ type: REQUEST_TASKS });
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Printer);
