import React from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Wrap = styled.div`
  font-size: 12px;
  user-select: none;
  line-height: 2;
  margin-left: -1em;
`;

const item = css`
  padding: 0 1em;
  display: inline-block;
  vertical-align: middle;
  color: #5d85e0;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Left = styled.div`
  ${item};
  width: 6em;
`;

const Right = styled.div`
  ${item};
  margin-left: 1.5em;
`;

const Operate = props => {
  const { id, taskStatus, taskCode } = props.data;
  const { makeViewTaskItem, makeCancel, makeDelete } = props;

  let search = qs.stringify({
    taskCode,
    restart: 'yes',
  });
  search = `?${search}`;

  const ContentRender = () => {
    switch (taskStatus) {
      case 'confirm':
      case 'wating':
      case 'doing':
        return (
          <Wrap>
            <Left onClick={() => makeViewTaskItem(props.data)}>查看</Left>
            <Right onClick={() => makeCancel(taskCode)}>取消</Right>
          </Wrap>
        );

      case 'fail':
      case 'cancel':
      case 'success':
        return (
          <Wrap>
            <Left as={Link} to={{ pathname: '/printpreview', search }}>
              重新打印
            </Left>
            <Right onClick={() => makeDelete(id)}>删除</Right>
          </Wrap>
        );

      case 'create':
        return (
          <Wrap>
            <Left />
            <Right onClick={() => makeDelete(id)}>删除</Right>
          </Wrap>
        );

      default:
        return null;
    }
  };

  return <ContentRender />;
};
Operate.propTypes = {
  data: PropTypes.object.isRequired,
  makeViewTaskItem: PropTypes.func.isRequired,
  makeCancel: PropTypes.func.isRequired,
  makeDelete: PropTypes.func.isRequired,
};

export default Operate;
