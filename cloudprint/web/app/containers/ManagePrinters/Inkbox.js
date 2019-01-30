import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersItem,
  makeSelectAppPrintersItemError,
} from 'containers/App/selectors/printers';

import Inkbox from './components/Printer/Inkbox';

const mapStateToProps = createStructuredSelector({
  itemIsFetching: makeSelectAppPrintersItemFetching(),
  item: makeSelectAppPrintersItem(),
  error: makeSelectAppPrintersItemError(),
});

export default connect(mapStateToProps)(Inkbox);
