import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import loadingSrc from 'containers/PrintPreview/images/loading.gif';

const Wrap = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  background-color: #fff;
  z-index: 9;
  transform: rotate(${props => (props.landscape ? '90deg' : '0')});
`;

const Error = styled.div`
  font-size: 12px;
  color: red;
`;

const Loading = styled.div`
  font-size: 12px;
  color: #333;
`;

const LoadingImg = styled.img`
  width: 50px;
  height: 50px;
`;

const Tip = ({ isFetching, error, landscape }) => {
  if (isFetching === true) {
    return (
      <Wrap landscape={landscape}>
        <Loading>
          <LoadingImg src={loadingSrc} />
        </Loading>
      </Wrap>
    );
  }
  if (error === true) {
    return (
      <Wrap landscape={landscape}>
        <Error>加载图片失败</Error>
      </Wrap>
    );
  }
  return null;
};

Tip.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  landscape: PropTypes.any,
};

export default Tip;
