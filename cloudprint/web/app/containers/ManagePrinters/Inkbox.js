import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Inkbox from './components/Printer/Inkbox';

import {
  makeSelectInkboxIsFetching,
  makeSelectInkboxData,
  makeSelectInkboxError,
} from './selectors/inkbox';

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectInkboxIsFetching(),
  data: makeSelectInkboxData(),
  error: makeSelectInkboxError(),
});

export default connect(mapStateToProps)(Inkbox);
