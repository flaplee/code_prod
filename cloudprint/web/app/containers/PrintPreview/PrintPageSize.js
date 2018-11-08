import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersItem,
} from 'containers/App/selectors/printers';

import DropOption from './components/PrintOption/DropOption';
import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const key = ['paperSize'];

const PrintPageSize = props => {
  const { item, printersFetching, itemFetching } = props;
  const list = (item && props.item.printerSettings.paperTypes) || false;
  return (
    <DropOption
      label="打印纸张"
      isFetching={printersFetching === true || itemFetching === true}
      list={list}
      {...props}
    />
  );
};

PrintPageSize.propTypes = {
  item: PropTypes.any.isRequired,
  printersFetching: PropTypes.bool.isRequired,
  itemFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  printersFetching: makeSelectAppPrintersIsFetching(),
  itemFetching: makeSelectAppPrintersItemFetching(),
  item: makeSelectAppPrintersItem(),
  value: makeSelectFormItem(key),
});

const mapDispatchToProps = dispatch => ({
  makeSelect: value => {
    dispatch(setForm({ key, value }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintPageSize);
