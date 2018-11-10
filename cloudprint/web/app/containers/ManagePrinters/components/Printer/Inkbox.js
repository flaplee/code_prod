import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import loadingSrc from 'images/loading-gray-500.gif';

import PrinterChart from './PrinterChart';

export const size = 360;

const Wrap = styled.div`
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

const Inkbox = ({ isFetching, data, error }) => (
  <Wrap>
    {(isFetching === true && (
      <Loading>
        <LoadingCenter>
          <LoadingImg src={loadingSrc} />
          <LoadingText>查询墨量信息中...</LoadingText>
        </LoadingCenter>
      </Loading>
    )) ||
      (data && <PrinterChart data={data} />) ||
      (error && (
        <ErrorWrap>
          <ErrorText>{error}</ErrorText>
        </ErrorWrap>
      ))}
  </Wrap>
);

Inkbox.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  error: PropTypes.any.isRequired,
};

export default Inkbox;
