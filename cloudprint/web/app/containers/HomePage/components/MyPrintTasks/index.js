/**
 * wating 等待中
 * fail 打印失败
 * success 打印成功
 * cancel 已取消
 * doing 正在打印
 * create 未开始
 * confirm 归类至 等待中
 */
import React from 'react';
import styled from 'styled-components';
import List from 'containers/HomePage/List';
import Pagination from 'containers/HomePage/Pagination';
import Title from 'containers/HomePage/TitleWithFresh';
import Head from './Head';

const Wrap = styled.div`
  padding: 0 20px;
  min-height: 500px;
`;

export default () => (
  <Wrap>
    <Title />
    <Head />
    <List />
    <Pagination />
  </Wrap>
);
