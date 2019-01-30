import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersItem,
} from 'containers/App/selectors/printers';

import PrintPageSize from './components/PrintOption/PrintPageSize';
import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const key = ['paperSize'];

const mapStateToProps = createStructuredSelector({
  printersFetching: makeSelectAppPrintersIsFetching(),
  itemFetching: makeSelectAppPrintersItemFetching(),
  item: makeSelectAppPrintersItem(),
  value: makeSelectFormItem(key),
});

const mapDispatchToProps = dispatch => ({
  makeSelect: value => {
    dispatch(setForm({ key, value }));
    // 每次切换 纸张 重置 打印模式单面
    dispatch(setForm({ key: ['duplexMode'], value: 0 }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintPageSize);
