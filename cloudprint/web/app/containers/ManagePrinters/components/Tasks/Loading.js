import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  margin-top: 15px;
  text-align: center;
`;

const Center = styled.div`
  display: inline-block;
  color: #999;
`;

export default () => (
  <Wrap>
    <Center>正在加载列表中...</Center>
  </Wrap>
);
