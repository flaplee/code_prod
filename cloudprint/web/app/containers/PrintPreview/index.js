import { captureException } from '@sentry/browser';

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import media from 'style/media';

import qs from 'qs';
import { debounce } from 'lodash';

import { connect } from 'react-redux';

import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { requestPrinters } from 'containers/App/actions/PrintersActions';

import ExtraParam from 'components/ExtraParam';

import Preview from './Preview';
import PrintOption from './components/PrintOption';
import ProcessModal from './ProcessModal';
import FormCheck from './FormCheck';

import { INIT } from './constants/InitTypes';

import { REQUEST_TASK } from './constants/TaskTypes';

import { setSearch } from './actions/SearchActions';

import key from './key';
import reducer from './reducers';
import saga from './sagas';

import sizeAdaption from './sizeAdaption';

const Wrap = styled.div`
  padding: 15px;
`;

const Content = styled.div`
  position: relative;
  text-align: center;
`;

const Center = styled.div`
  display: inline-block;
  font-size: 0;
  text-align: left;
`;

const RightSide = styled.div`
  display: inline-block;
  width: 100%;
  padding: 0 15px;
  ${media.extraLarge`
    padding: 0 60px;
  `};
  font-size: 12px;
  vertical-align: middle;
  background-color: #fff;
`;

class PrintPreview extends React.PureComponent {
  contentRef = React.createRef();

  rightSideRef = React.createRef();

  state = {
    preview: {
      width: 700,
      height: 970,
      side: 90,
    },
  };

  setPreview = screen => {
    const preview = sizeAdaption(screen);

    this.setState(
      {
        preview,
      },
      this.setRight,
    );
  };

  setRight = () => {
    const { preview } = this.state;
    const righWidth = this.contentRef.current.clientWidth - preview.width;
    const width = righWidth < 600 ? righWidth : 600;
    this.rightSideRef.current.style.width = `${width}px`;
    this.rightSideRef.current.style.height = `${preview.height}px`;
  };

  adjustSize = () => {
    const bodyWidth = document.body.clientWidth;
    this.setPreview(bodyWidth);
  };

  debounceAdjustSize = debounce(this.adjustSize, 150);

  componentDidMount() {
    this.props.init();
    const { search } = this.props.location;
    const params = qs.parse(search.slice(1));

    this.props.setSearch(params);

    this.props.requestPrinters();
    this.props.fetchTask();

    this.adjustSize();

    window.addEventListener('resize', this.debounceAdjustSize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceAdjustSize, false);
  }

  componentDidCatch(error) {
    captureException(error);
  }

  render() {
    const { preview } = this.state;
    return (
      <Wrap>
        <Content ref={this.contentRef}>
          <ExtraParam />
          <Helmet>
            <title>打印预览</title>
          </Helmet>
          <Center>
            <Preview size={preview} />
            <RightSide ref={this.rightSideRef}>
              <PrintOption />
            </RightSide>
          </Center>
        </Content>
        <ProcessModal />
        <FormCheck />
      </Wrap>
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
