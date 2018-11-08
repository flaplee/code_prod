import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Pagination from 'components/Pagination';

import PAGE_SIZE from 'containers/HomePage/pageSize';

import {
  makeSelectViewTaskItemIsFetching,
  makeSelectViewTaskItemDetail,
  makeSelectViewTaskItemPage,
} from './selectors/viewTaskItem';

import { setViewTaskItemPage } from './actions/ViewTaskItemActions';

import { REQUEST_VIEW_TASK_ITEM_DETAIL } from './constants/ViewTaskItemTypes';

const Wrap = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const MyTasksPagination = ({ data, isFetching, page, ...props }) => {
  if (isFetching === true) return null;
  if (data === false) return null;
  const rows = (data && data.rows) || [];
  if (rows.length === 0) return null;
  const pages = Math.ceil(data.total / PAGE_SIZE.viewTaskItem);
  return (
    <Wrap>
      <Pagination pages={pages} page={page} {...props} />
    </Wrap>
  );
};

MyTasksPagination.propTypes = {
  isFetching: PropTypes.bool,
  data: PropTypes.any,
  page: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectViewTaskItemIsFetching(),
  page: makeSelectViewTaskItemPage(),
  data: makeSelectViewTaskItemDetail(),
});

const mapDispatchToProps = dispatch => ({
  handleNum: value => {
    dispatch(setViewTaskItemPage(value));
    dispatch({ type: REQUEST_VIEW_TASK_ITEM_DETAIL });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyTasksPagination);
