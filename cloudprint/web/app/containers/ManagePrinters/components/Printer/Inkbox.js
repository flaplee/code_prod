import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import loadingSrc from 'images/loading-gray-500.gif';
import Chart from './Chart';

export const size = 360;

const Wrap = styled.div`
  position: relative;
  float: right;
  width: ${size}px;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const Loading = styled.div`
  text-align: center;
  line-height: 360px;
`;

const LoadingCenter = styled.div`
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
`;

const LoadingImg = styled.img`
  width: 50px;
  height: 50px;
  vertical-align: middle;
`;

const LoadingText = styled.div`
  color: #999;
`;

const ErrorWrap = styled.div`
  line-height: 360px;
  text-align: center;
`;

const ErrorText = styled.div`
  color: #999;
`;

const Inkbox = ({ itemIsFetching, item, error }) => {
  const { onlineStatus, inkboxDetails } = item;

  const renderContent = () => {
    if (itemIsFetching === true) {
      return (
        <Loading>
          <LoadingCenter>
            <LoadingImg src={loadingSrc} />
            <LoadingText>查询墨量信息中...</LoadingText>
          </LoadingCenter>
        </Loading>
      );
    }

    if (error) {
      return (
        <ErrorWrap>
          <ErrorText>{error}</ErrorText>
        </ErrorWrap>
      );
    }

    if (onlineStatus !== '1') {
      return (
        <ErrorWrap>
          <ErrorText>设备现处离线状态</ErrorText>
        </ErrorWrap>
      );
    }

    if (!inkboxDetails || inkboxDetails.length < 1) {
      return (
        <ErrorWrap>
          <ErrorText>未查询到墨量</ErrorText>
        </ErrorWrap>
      );
    }

    return <Chart {...item} />;
  };
  return <Wrap>{renderContent()}</Wrap>;
};

Inkbox.propTypes = {
  itemIsFetching: PropTypes.bool.isRequired,
  item: PropTypes.any.isRequired,
  error: PropTypes.any.isRequired,
};

export default Inkbox;
