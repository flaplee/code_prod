import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersCurrent,
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersError,
} from 'containers/App/selectors/printers';

import PrinerStatus from './components/PrintOption/PrinerStatus';

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectAppPrintersIsFetching(),
  current: makeSelectAppPrintersCurrent(),
  error: makeSelectAppPrintersError(),
});

export default connect(mapStateToProps)(PrinerStatus);
