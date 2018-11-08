import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { width } from 'components/SideNav';

const Wrap = styled.div`
  margin-left: ${width}px;
`;

const RightSide = ({ children }) => <Wrap>{children}</Wrap>;

RightSide.propTypes = {
  children: PropTypes.any,
};

export default RightSide;
