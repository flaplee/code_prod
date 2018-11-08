import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import refreshImg from 'containers/HomePage/images/refresh.png';

const Wrap = styled.div`
  margin-top: 38px;
  line-height: 28px;
`;

const Text = styled.div`
  display: inline-block;
  width: 50%;
  font-size: 16px;
  font-weight: bold;
  vertical-align: middle;
`;

const RightSide = styled.div`
  display: inline-block;
  width: 50%;
  font-size: 0;
  text-align: right;
  vertical-align: middle;
`;

const Refresh = styled.div`
  display: inline-block;
  width: 80px;
  text-align: center;
  border: 1px solid #5d85e0;
  border-radius: 3px;
  color: #5d85e0;
  font-size: 0;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
`;

const RefreshIcon = styled.img`
  width: 16px;
  height: 14px;
  vertical-align: middle;
`;

const RefreshText = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.5em;
  font-size: 16px;
`;

const Title = ({ isFetching, handleRefresh }) => (
  <Wrap>
    <Text>正在进行中的任务</Text>
    <RightSide>
      {isFetching === false && (
        <Refresh onClick={handleRefresh}>
          <RefreshIcon src={refreshImg} />
          <RefreshText>刷新</RefreshText>
        </Refresh>
      )}
    </RightSide>
  </Wrap>
);

Title.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};
export default Title;
