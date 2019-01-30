/**
 *
 * Layout
 *
 */
import { captureException } from '@sentry/browser';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { requestPrinters } from 'containers/App/actions/PrintersActions';

import ExtraParam from 'components/ExtraParam';

import Modal from './Modal';
import Printer from './Printer';
import Tasks from './components/Tasks';
import Pagination from './Pagination';

import key from './key';
import reducer from './reducers';
import saga from './sagas';

const Wrap = styled.div`
  padding: 20px;
`;

const Content = styled.div`
  padding: 42px 0;
  border-radius: 10px;
  background-color: #fff;
`;

class ManagePrinters extends React.PureComponent {
  componentDidMount() {
    this.props.init();
  }

  componentDidCatch(error) {
    captureException(error);
  }

  render() {
    return (
      <Wrap>
        <ExtraParam />
        <Content>
          <Helmet>
            <title>打印机管理</title>
          </Helmet>
          <Printer />
          <Tasks />
          <Pagination />
        </Content>
        <Modal />
      </Wrap>
    );
  }
}

ManagePrinters.propTypes = {
  init: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: () => {
    dispatch(requestPrinters());
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
)(ManagePrinters);
