import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import CopyCount from './components/PrintOption/CopyCount';

import { makeSelectFormItem } from './selectors/form';

import { setForm } from './actions/FormActions';

const key = ['copyCount'];

const mapStateToProps = createStructuredSelector({
  count: makeSelectFormItem(key),
});

const verify = value => {
  if (value < 1) return false;
  if (value > 99) return false;
  return true;
};

const mapDispatchToProps = dispatch => ({
  typeCopyCount: value => {
    if (verify(value) === false) {
      return; // break
    }
    dispatch(setForm({ key, value }));
  },
  increase: value => {
    if (verify(value) === false) {
      return; // break
    }
    dispatch(setForm({ key, value }));
  },
  decrease: value => {
    if (verify(value) === false) {
      return; // break
    }
    dispatch(setForm({ key, value }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CopyCount);
