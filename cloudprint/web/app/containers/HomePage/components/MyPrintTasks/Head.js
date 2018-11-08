import React from 'react';
import styled from 'styled-components';
import { SIZE } from './Item';

const Wrap = styled.div`
  margin-top: 15px;
  padding: 0 30px;
  line-height: 40px;
  text-align: left;
  color: #333;
  background-color: #f2f2f2;
`;

const Col = styled.div`
  display: inline-block;
  padding: 0 15px;
  line-height: 1.5;
  width: ${props => props.size}%;
`;

export default () => (
  <Wrap>
    <Col size={SIZE[0]}>文件名</Col>
    <Col size={SIZE[1]}>打印机</Col>
    <Col size={SIZE[2]}>时间</Col>
    <Col size={SIZE[3]}>状态</Col>
    <Col size={SIZE[4]}>操作</Col>
  </Wrap>
);
