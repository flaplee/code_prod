import React from 'react';
import styled from 'styled-components';
import loadingSrc from 'images/loading-gray-500.gif';

const Wrap = styled.div`
  margin-top: 80px;
  text-align: center;
`;

const Center = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const LoadingImg = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 5px;
`;

export default () => (
  <Wrap>
    <Center>
      <LoadingImg src={loadingSrc} />
      正在查询打印机...
    </Center>
  </Wrap>
);
