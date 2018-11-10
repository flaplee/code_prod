import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ViewTaskItem from './components/ViewTaskItem';

import {
  makeSelectViewTaskItemShow,
  makeSelectViewTaskItemTarget,
  makeSelectViewTaskItemIsFetching,
  makeSelectViewTaskItemDetail,
} from './selectors/viewTaskItem';

import { TOGGLE_VIEW_TASK_ITEM } from './constants/ViewTaskItemTypes';

import { setModal } from './actions/ModalActions';

const mapStateToProps = createStructuredSelector({
  show: makeSelectViewTaskItemShow(),
  detail: makeSelectViewTaskItemDetail(),
  target: makeSelectViewTaskItemTarget(),
  isFetching: makeSelectViewTaskItemIsFetching(),
});

const mapDispatchToProps = dispatch => ({
  makeClose: () => {
    dispatch({ type: TOGGLE_VIEW_TASK_ITEM });
  },
  handleCancel: taskCode => {
    dispatch(setModal({ type: 'cancel item', target: { taskCode } }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewTaskItem);
