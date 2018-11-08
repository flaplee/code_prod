import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import List from './components/Tasks/List';
import { setModal } from './actions/ModalActions';

import {
  makeSelectTasksIsFetching,
  makeSelectTasksData,
} from './selectors/tasks';

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectTasksIsFetching(),
  data: makeSelectTasksData(),
});

const mapDispatchToProps = dispatch => ({
  handleCancel: taskCode => {
    dispatch(setModal({ type: 'cancel', target: { taskCode } }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(List);
