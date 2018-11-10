import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrap = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  z-index: ${props => (props.show ? '8888' : '-10')};
  transition: 0.3s;
`;

const Box = styled.div`
  display: inline-block;
  margin-top: ${50 + 80}px;
  opacity: ${props => (props.show ? 1 : 0)};
  transform: translateY(${props => (props.show ? '0' : '-50px')});
  transition: 0.5s;
`;

/* eslint-disable  arrow-body-style */
const Modal = ({ show, children }) => {
  return (
    <Wrap show={show}>
      <Box show={show}>{children}</Box>
    </Wrap>
  );
};

Modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.any,
};

Modal.defaultProps = {
  show: false,
};

export default Modal;
