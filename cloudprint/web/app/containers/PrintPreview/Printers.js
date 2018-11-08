import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { requestPrinterItem } from 'containers/App/actions/PrintersActions';

import {
  makeSelectAppPrintersData,
  makeSelectAppPrintersCurrent,
} from 'containers/App/selectors/printers';

import PrintersOption from './components/PrintOption/PrintersOption';

import { setForm } from './actions/FormActions';

const Printers = props => <PrintersOption label="打印机" {...props} />;

const key = ['printerSn'];

const mapStateToProps = createStructuredSelector({
  current: makeSelectAppPrintersCurrent(),
  list: makeSelectAppPrintersData(),
});

const mapDispatchToProps = dispatch => ({
  makeSelect: value => {
    const { printerSn } = value;
    dispatch(requestPrinterItem(value));
    dispatch(setForm({ key, value: printerSn }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Printers);
