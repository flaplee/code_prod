import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersItemFetching,
  makeSelectAppPrintersItem,
} from 'containers/App/selectors/printers';

import BlockOption from './components/PrintOption/BlockOption';
import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const key = ['duplexMode'];

const getList = arr =>
  arr.map(value => {
    switch (value) {
      case 1:
        return {
          name: '双面',
          value,
        };

      case 0:
        return {
          name: '单面',
          value,
        };

      default:
        return false;
    }
  });

const DuplexMode = props => {
  const { item, printersFetching, itemFetching } = props;
  const list =
    (item && getList(props.item.printerSettings.duplexModes)) || false;
  return (
    <BlockOption
      label="打印模式"
      list={list}
      isFetching={printersFetching === true || itemFetching === true}
      {...props}
    />
  );
};

DuplexMode.propTypes = {
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
)(DuplexMode);
