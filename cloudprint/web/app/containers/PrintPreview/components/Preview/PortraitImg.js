import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import loadImageAsync from 'utils/loadImageAsync';
import makeCancelable from 'utils/makeCancelable';

const Wrap = styled.img`
  display: inline-block;
  vertical-align: middle;
  transform: scale(0.92);
`;

class PortraitImg extends React.PureComponent {
  unsubscribe = () => {};

  componentDidMount() {
    this.updateImg();
  }

  updateImg = () => {
    const { src, request, receive, error } = this.props;

    request();

    const { promise, cancel } = makeCancelable(loadImageAsync(src));
    this.unsubscribe = cancel;
    promise
      .then(() => {
        receive();
      })
      .catch(e => {
        const { isCanceled } = e || {};
        if (isCanceled) return;
        error();
      });
  };

  componentDidUpdate(prevState) {
    const { src } = this.props;
    if (prevState.src !== src) {
      this.updateImg();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { src } = this.props;
    return <Wrap src={src} />;
  }
}

PortraitImg.propTypes = {
  src: PropTypes.string.isRequired,
  request: PropTypes.func.isRequired,
  receive: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
};

export default PortraitImg;
