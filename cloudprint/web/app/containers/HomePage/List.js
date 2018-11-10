import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import List from './components/MyPrintTasks/List';

import {
  selectListIsFetching,
  selectListData,
  selectListError,
} from './selectors/list';

const mapStateToProps = createStructuredSelector({
  isFetching: selectListIsFetching(),
  data: selectListData(),
  error: selectListError(),
});

export default connect(mapStateToProps)(List);
