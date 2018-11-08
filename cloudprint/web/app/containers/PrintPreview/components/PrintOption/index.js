import React from 'react';
import styled from 'styled-components';
import PrinerStatus from 'containers/PrintPreview/PrinerStatus';
import Form from './Form';

const Wrap = styled.div`
  display: inline-block;
  width: 500px;
  height: 970px;
  padding: 0 60px;
  font-size: 12px;
  vertical-align: middle;
  background-color: #fff;
`;

export default () => (
  <Wrap>
    <PrinerStatus />
    <Form />
  </Wrap>
);
