import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import apis from 'containers/PrintPreview/apis';
import Tip from './Tip';
import LandscapeImg from './LandscapeImg';

const Wrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: rotate(${props => (props.show ? '-90deg' : '0')});
  transform-origin: center;
  transition: 0.3s;
  background-color: #fff;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  z-index: ${props => (props.show ? '9' : '-10')};
`;

class Landscape extends React.PureComponent {
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
      <Wrap show={printDirection === 1}>
        <Tip {...this.state} landscape />
        <LandscapeImg
          request={this.request}
          receive={this.receive}
          error={this.error}
          src={`${apis.preview}/${fileId}_${imgIndex}_${h}_${w}`}
        />
      </Wrap>
    );
  }
}

Landscape.propTypes = {
  fileId: PropTypes.string.isRequired,
  printDirection: PropTypes.number.isRequired,
  imgIndex: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Landscape;
