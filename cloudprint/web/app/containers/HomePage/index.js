/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import qs from 'qs';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import ExtraParam from 'components/ExtraParam';

import Modal from './Modal';
import ViewTaskItem from './ViewTaskItem';

import MyPrintTasks from './components/MyPrintTasks';
import UploadFile from './UploadFile';

import key from './key';
import reducer from './reducers';
import saga from './sagas';

import { INIT } from './constants/InitTypes';

import { REQUEST_LIST } from './constants/ListTypes';

import { setListPage } from './actions/ListActions';

const Wrap = styled.div`
  padding: 20px;
`;

const Content = styled.div`
  padding: 42px 0;
  border-radius: 10px;
  background-color: #fff;
`;

/* eslint-disable react/prefer-stateless-function */
class HomePage extends React.PureComponent {
  componentDidMount() {
    this.props.init();
    const { search } = this.props.location;
    const { page } = qs.parse(search.slice(1));
    if (page) {
      this.props.setListPage(page);
    }

    this.props.fetchList();
  }
  render() {
    return (
      <Wrap>
        <ExtraParam />
        <Content>
          <Helmet>
            <title>首页</title>
          </Helmet>
          <UploadFile />
          <MyPrintTasks />
          <Modal />
          <ViewTaskItem />
        </Content>
      </Wrap>
    );
  }
}

HomePage.propTypes = {
  location: PropTypes.object.isRequired,
  init: PropTypes.func.isRequired,
  setListPage: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: () => {
    dispatch({ type: INIT });
  },

  setListPage: value => {
    dispatch(setListPage(value));
  },
  fetchList: () => {
    dispatch({ type: REQUEST_LIST });
  },
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key, reducer });
const withSaga = injectSaga({ key, saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
