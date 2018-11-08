import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: block;
  margin-top: 10em;
  text-align: center;
  color: #999;
`;

const LoadingIndicator = () => <Wrap>正在加载页面...</Wrap>;

export default LoadingIndicator;
