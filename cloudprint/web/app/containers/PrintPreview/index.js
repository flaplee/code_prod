import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import qs from 'qs';

import { connect } from 'react-redux';

import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { requestPrinters } from 'containers/App/actions/PrintersActions';

import ExtraParam from 'components/ExtraParam';

import Preview from './Preview';
import PrintOption from './components/PrintOption';
import FormCheck from './FormCheck';

import { INIT } from './constants/InitTypes';

import { REQUEST_TASK } from './constants/TaskTypes';

import { setSearch } from './actions/SearchActions';

import key from './key';
import reducer from './reducers';
import saga from './sagas';

const Content = styled.div`
  position: relative;
  left: -80px;
  margin-top: 20px;
  text-align: center;
`;

const Center = styled.div`
  display: inline-block;
  font-size: 0;
  text-align: left;
`;

class PrintPreview extends React.PureComponent {
  componentDidMount() {
    this.props.init();
    const { search } = this.props.location;
    const params = qs.parse(search.slice(1));

    this.props.setSearch(params);

    this.props.requestPrinters();
    this.props.fetchTask();
  }
  render() {
    return (
      <Content>
        <ExtraParam />
        <Helmet>
          <title>打印预览</title>
        </Helmet>
        <Center>
          <Preview />
          <PrintOption />
        </Center>
        <FormCheck />
      </Content>
    );
  }
}

PrintPreview.propTypes = {
  init: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  requestPrinters: PropTypes.func.isRequired,
  fetchTask: PropTypes.func.isRequired,
  location: PropTypes.any.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: () => {
    dispatch({ type: INIT });
  },

  setSearch: value => {
    dispatch(setSearch(value));
  },

  requestPrinters: () => {
    dispatch(requestPrinters());
  },

  fetchTask: () => {
    dispatch({ type: REQUEST_TASK });
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
)(PrintPreview);
