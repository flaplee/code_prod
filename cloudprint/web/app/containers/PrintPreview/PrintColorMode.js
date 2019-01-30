import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersItem,
} from 'containers/App/selectors/printers';

import PrintColorMode from './components/PrintOption/PrintColorMode';

import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const key = ['printColorMode'];

const mapStateToProps = createStructuredSelector({
  printersFetching: makeSelectAppPrintersIsFetching(),
  itemFetching: makeSelectAppPrintersItemFetching(),
  item: makeSelectAppPrintersItem(),
  value: makeSelectFormItem(key),
});

const mapDispatchToProps = dispatch => ({
  makeSelect: item => {
    const { value } = item;
    dispatch(setForm({ key, value }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintColorMode);
