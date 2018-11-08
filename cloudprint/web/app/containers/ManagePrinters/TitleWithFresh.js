import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Title from './components/Tasks/Title';

import { makeSelectTasksIsFetching } from './selectors/tasks';

import { REQUEST_TASKS } from './constants/TasksTypes';

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectTasksIsFetching(),
});

const mapDispatchToProps = dispatch => ({
  handleRefresh: () => {
    dispatch({ type: REQUEST_TASKS });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Title);
