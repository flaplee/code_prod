import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Pagination from 'components/Pagination';

import PAGE_SIZE from 'containers/HomePage/pageSize';

import {
  selectListIsFetching,
  selectListPage,
  selectListData,
} from './selectors/list';

import { setListPage } from './actions/ListActions';

import { REQUEST_LIST } from './constants/ListTypes';

const Wrap = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const MyTasksPagination = ({ data, isFetching, page, ...props }) => {
  if (isFetching === true) return null;
  if (data === false) return null;
  if (data.rows.length === 0) return null;
  const pages = Math.ceil(data.total / PAGE_SIZE.myPrintTasks);
  return (
    <Wrap>
      <Pagination localUrl="/" pages={pages} page={page} {...props} />
    </Wrap>
  );
};

MyTasksPagination.propTypes = {
  isFetching: PropTypes.bool,
  data: PropTypes.any,
  page: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isFetching: selectListIsFetching(),
  page: selectListPage(),
  data: selectListData(),
});

const mapDispatchToProps = dispatch => ({
  handleNum: value => {
    dispatch(setListPage(value));
    dispatch({ type: REQUEST_LIST });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyTasksPagination);
