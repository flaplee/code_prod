import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import loadingSrc from 'images/loading-gray-500.gif';

const Wrap = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  line-height: 300px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  z-index: ${props => (props.show ? '9999' : '-10')};
  transition: 0.3s;
`;

const Center = styled.div`
  display: inline-block;
  line-height: 1;
`;

const Text = styled.div`
  font-size: 12px;
  color: #5d85e0;
`;

const LoadingImg = styled.img`
  width: 50px;
  height: 50px;
`;

const SpinAlert = ({ show }) => (
  <Wrap show={show}>
    <Center>
      <LoadingImg src={loadingSrc} />
      <Text>表单初始化中....</Text>
    </Center>
  </Wrap>
);

SpinAlert.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default SpinAlert;
