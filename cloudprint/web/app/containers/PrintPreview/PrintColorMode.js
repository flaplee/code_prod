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

const key = ['printColorMode'];

const getList = arr =>
  arr.map(value => {
    switch (value) {
      case 'black':
        return {
          name: '黑白',
          value,
        };

      default:
        return false;
    }
  });

const PrintDirection = props => {
  const { item, printersFetching, itemFetching } = props;
  const list =
    (item && getList(props.item.printerSettings.colorTypes)) || false;
  return (
    <BlockOption
      list={list}
      label="打印颜色"
      isFetching={printersFetching === true || itemFetching === true}
      {...props}
    />
  );
};

PrintDirection.propTypes = {
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
)(PrintDirection);
