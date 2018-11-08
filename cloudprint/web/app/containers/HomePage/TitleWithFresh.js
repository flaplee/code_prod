import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Title from './components/MyPrintTasks/Title';

import { selectListIsFetching } from './selectors/list';

import { REQUEST_LIST } from './constants/ListTypes';

const mapStateToProps = createStructuredSelector({
  isFetching: selectListIsFetching(),
});

const mapDispatchToProps = dispatch => ({
  handleRefresh: () => {
    dispatch({ type: REQUEST_LIST });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Title);
