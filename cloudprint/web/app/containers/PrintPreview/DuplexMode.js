import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersItem,
} from 'containers/App/selectors/printers';

import DuplexMode from './components/PrintOption/DuplexMode';
import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const key = ['duplexMode'];

const mapStateToProps = createStructuredSelector({
  printersFetching: makeSelectAppPrintersIsFetching(),
  itemFetching: makeSelectAppPrintersItemFetching(),
  item: makeSelectAppPrintersItem(),
  paperSize: makeSelectFormItem(['paperSize']),
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
)(DuplexMode);
