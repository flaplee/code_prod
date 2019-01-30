import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import apis from 'containers/PrintPreview/apis';
import Tip from './Tip';
import PortraitImg from './PortraitImg';

const Wrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #fff;
  transform: rotate(${props => (props.show ? '0' : '-90deg')});
  transform-origin: center;
  transition: 0.3s;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  z-index: ${props => (props.show ? '9' : '-10')};
`;

class Portrait extends React.PureComponent {
  state = {
    isFetching: false,
    error: false,
  };

  request = () => {
    this.setState({
      isFetching: true,
      error: false,
    });
  };

  receive = () => {
    this.setState({
      isFetching: false,
    });
  };

  error = () => {
    this.setState({
      isFetching: false,
      error: true,
    });
  };

  render() {
    const { imgIndex, fileId, w, h, printDirection } = this.props;
    return (
      <Wrap show={printDirection !== 1}>
        <Tip {...this.state} />
        <PortraitImg
          request={this.request}
          receive={this.receive}
          error={this.error}
          src={`${apis.preview}/${fileId}_${imgIndex}_${w}_${h}`}
        />
      </Wrap>
    );
  }
}

Portrait.propTypes = {
  fileId: PropTypes.string.isRequired,
  printDirection: PropTypes.number.isRequired,
  imgIndex: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Portrait;
