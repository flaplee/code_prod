import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import CopyCount from './components/PrintOption/CopyCount';

import { makeSelectFormItem } from './selectors/form';

import { setForm } from './actions/FormActions';

const key = ['copyCount'];

const mapStateToProps = createStructuredSelector({
  count: makeSelectFormItem(key),
});

const mapDispatchToProps = dispatch => ({
  typeCopyCount: value => {
    dispatch(setForm({ key, value }));
  },
  increase: value => {
    dispatch(setForm({ key, value }));
  },
  decrease: value => {
    dispatch(setForm({ key, value }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CopyCount);
