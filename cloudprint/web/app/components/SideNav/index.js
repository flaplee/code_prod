import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { a, b } from './hold';
import Tag from './Tag';

export const width = 120;
const Wrap = styled.div`
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  width: ${width}px;
  float: left;
  background-color: #e3e6e5;
  z-index: 888;
`;

const Nav = styled.div`
  display: inline-block;
  width: 100%;
  font-size: 14px;
  color: #333;
  line-height: 40px;
  text-align: center;
  vertical-align: middle;
`;

/* eslint-disable  arrow-body-style */
const SideNav = () => {
  return (
    <Wrap>
      <Tag hold={a}>
        <Nav as={Link} to="/">
          得力云打印
        </Nav>
      </Tag>
      <Tag hold={b}>
        <Nav as={Link} to="/manageprinters">
          打印机管理
        </Nav>
      </Tag>
    </Wrap>
  );
};

export default SideNav;
