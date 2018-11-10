import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BlockOption from './components/PrintOption/BlockOption';
import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const list = [
  {
    name: '速度',
    value: 300,
  },
  {
    name: '均衡',
    value: 600,
  },
  {
    name: '质量',
    value: 1200,
  },
];

const key = ['printDpi'];

const PrintDpi = props => (
  <BlockOption label="打印质量" list={list} isFetching={false} {...props} />
);

const mapStateToProps = createStructuredSelector({
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
)(PrintDpi);
