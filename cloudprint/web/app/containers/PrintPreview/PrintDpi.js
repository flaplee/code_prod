import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PrintDpi from './components/PrintOption/PrintDpi';
import { makeSelectFormItem } from './selectors/form';
import { setForm } from './actions/FormActions';

const key = ['printDpi'];

const mapStateToProps = createStructuredSelector({
  value: makeSelectFormItem(key),
});

const mapDispatchToProps = dispatch => ({
  makeSelect: item => {
    const { value } = item;
    dispatch(setForm({ key, value }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintDpi);
