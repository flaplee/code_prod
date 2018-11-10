import styled from 'styled-components';
import clearfix from 'style/chunk/clearfix';
import { width } from 'components/SideNav';

export const Content = styled.div`
  ${clearfix};
`;

export const RightSideWrap = styled.div`
  padding: 15px;
  margin-left: ${width}px;
`;

export const RightSide = styled.div`
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #fff;
`;
