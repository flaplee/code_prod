import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Pagination from 'components/Pagination';

import PAGE_SIZE from 'containers/ManagePrinters/pageSize';

import {
  makeSelectTasksIsFetching,
  makeSelectTasksData,
  makeSelectTasksPage,
} from './selectors/tasks';

import { REQUEST_TASKS } from './constants/TasksTypes';

import { setTasksPage } from './actions/TasksActions';

const Wrap = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const MyTasksPagination = ({ data, isFetching, page, ...props }) => {
  if (isFetching === true) return null;
  if (data === false) return null;
  const pages = Math.ceil(data.total / PAGE_SIZE.tasks);
  if (pages <= 1) return null;
  return (
    <Wrap>
      <Pagination
        // localUrl="/manageprinters"
        pages={pages}
        page={page}
        {...props}
      />
    </Wrap>
  );
};

MyTasksPagination.propTypes = {
  isFetching: PropTypes.bool,
  data: PropTypes.any,
  page: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectTasksIsFetching(),
  data: makeSelectTasksData(),
  page: makeSelectTasksPage(),
});

const mapDispatchToProps = dispatch => ({
  handleNum: value => {
    dispatch(setTasksPage(value));
    dispatch({ type: REQUEST_TASKS });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyTasksPagination);
