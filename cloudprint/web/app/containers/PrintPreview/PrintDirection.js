import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BlockOption from './components/PrintOption/BlockOption';
import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const list = [
  {
    name: '横向',
    value: 1,
  },
  {
    name: '纵向',
    value: 2,
  },
];

const key = ['printDirection'];

const PrintDirection = props => (
  <BlockOption label="打印方向" list={list} isFetching={false} {...props} />
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
)(PrintDirection);
