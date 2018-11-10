import React from 'react';
import styled from 'styled-components';
import TasksList from 'containers/ManagePrinters/TasksList';
import Title from 'containers/ManagePrinters/TitleWithFresh';
import { Head } from './Item';

const Wrap = styled.div`
  padding: 0 20px;
  min-height: 300px;
`;
export default props => (
  <Wrap>
    <Title />
    <Head />
    <TasksList {...props} />
  </Wrap>
);
