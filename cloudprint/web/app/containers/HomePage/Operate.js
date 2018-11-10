import { connect } from 'react-redux';

import Operate from './components/MyPrintTasks/Operate';

import { setModal } from './actions/ModalActions';

import {
  setViewTaskItemTarget,
  setViewTaskItemPage,
} from './actions/ViewTaskItemActions';

import {
  TOGGLE_VIEW_TASK_ITEM,
  REQUEST_VIEW_TASK_ITEM_DETAIL,
} from './constants/ViewTaskItemTypes';

const mapDispatchToProps = dispatch => ({
  makeViewTaskItem: value => {
    dispatch(setViewTaskItemPage(1)); // 每次打开弹窗 重置到第一页
    dispatch(setViewTaskItemTarget(value));

    dispatch({ type: TOGGLE_VIEW_TASK_ITEM });
    dispatch({ type: REQUEST_VIEW_TASK_ITEM_DETAIL });
  },
  makeCancel: taskCode => {
    dispatch(setModal({ type: 'cancel', target: { taskCode } }));
  },
  makeDelete: id => {
    dispatch(setModal({ type: 'delete', target: { id } }));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(Operate);
