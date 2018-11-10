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
  transform: rotate(-90deg);
  background-color: #fff;
  z-index: 2;
`;

const Img = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
`;

class Landscape extends React.Component {
  imgRef = React.createRef();

  state = {
    complete: false,
    error: false,
  };

  loadSuccess = () => {
    const imgEle = this.imgRef.current;
    imgEle.style.marginLeft = `-${imgEle.width / 2}px`;
    imgEle.style.marginTop = `-${imgEle.height / 2}px`;

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
      <Wrap show={printDirection !== 1}>
        <Tip {...this.state} landscape />
        <Img
          ref={this.imgRef}
          src={`${apis.preview}/${fileId}_${imgIndex}_${h}_${w}`}
          onLoad={this.loadSuccess}
          onError={this.loadError}
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
