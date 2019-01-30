import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import loadImageAsync from 'utils/loadImageAsync';
import makeCancelable from 'utils/makeCancelable';

const Wrap = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: scale(0.92);
`;

class LandscapeImg extends React.PureComponent {
  imgRef = React.createRef();

  unsubscribe = () => {};

  componentDidMount() {
    this.updateImg();
  }

  makeReceive = () => {
    const { receive } = this.props;
    receive();
    if (this.imgRef && this.imgRef.current) {
      const imgEle = this.imgRef.current;
      imgEle.style.marginLeft = `-${imgEle.width / 2}px`;
      imgEle.style.marginTop = `-${imgEle.height / 2}px`;
    }
  };

  updateImg = () => {
    const { src, request, error } = this.props;

    request();

    const { promise, cancel } = makeCancelable(loadImageAsync(src));
    this.unsubscribe = cancel;
    promise
      .then(() => {
        this.makeReceive();
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
    return <Wrap ref={this.imgRef} src={src} />;
  }
}

LandscapeImg.propTypes = {
  src: PropTypes.string.isRequired,
  request: PropTypes.func.isRequired,
  receive: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
};

export default LandscapeImg;
