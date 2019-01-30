import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersItem,
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersItemError,
} from 'containers/App/selectors/printers';

import PrinterStatus from './components/PrintOption/PrinterStatus';

const PrinterStatusView = ({ listFetching, itemFetching, ...props }) => (
  <PrinterStatus
    isFetching={listFetching === true || itemFetching === true}
    {...props}
  />
);

PrinterStatusView.propTypes = {
  listFetching: PropTypes.bool.isRequired,
  itemFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  listFetching: makeSelectAppPrintersIsFetching(),
  itemFetching: makeSelectAppPrintersItemFetching(),
  item: makeSelectAppPrintersItem(),
  error: makeSelectAppPrintersItemError(),
});

export default connect(mapStateToProps)(PrinterStatusView);
