import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Range from './components/PrintOption/Range';

import { makeSelectFormItem } from './selectors/form';

import { setForm } from './actions/FormActions';

const mapStateToProps = createStructuredSelector({
  isPrintWhole: makeSelectFormItem(['printWhole']),
  printStartPage: makeSelectFormItem(['printStartPage']),
  printEndPage: makeSelectFormItem(['printEndPage']),
});

const mapDispatchToProps = dispatch => ({
  makeSelectWhole: () => {
    dispatch(setForm({ key: ['printWhole'], value: 1 }));
  },
  makeSelectPage: () => {
    dispatch(setForm({ key: ['printWhole'], value: 0 }));
  },
  typePrintStartPage: value => {
    dispatch(setForm({ key: ['printStartPage'], value }));
  },
  typePrintEndPage: value => {
    dispatch(setForm({ key: ['printEndPage'], value }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Range);
