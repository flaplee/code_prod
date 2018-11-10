import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import apis from 'containers/PrintPreview/apis';
import Tip from './Tip';

const Wrap = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #fff;
  z-index: 2;
`;

const Img = styled.img`
  display: inline-block;
  vertical-align: middle;
`;

class Portrait extends React.Component {
  state = {
    complete: false,
    error: false,
  };

  loadSuccess = () => {
    this.setState({
      complete: true,
    });
  };

  loadError = () => {
    this.setState({
      complete: true,
      error: true,
    });
  };

  render() {
    const { imgIndex, fileId, w, h, printDirection } = this.props;
    return (
      <Wrap show={printDirection === 1}>
        <Tip {...this.state} />
        <Img
          ref={this.imgRef}
          src={`${apis.preview}/${fileId}_${imgIndex}_${w}_${h}`}
          onLoad={this.loadSuccess}
          onError={this.loadError}
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
