import React from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import withTooltip from 'components/Tooltip';

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

const DisablePrintAgain = styled.div`
  position: relative;
  padding: 0 1em;
  width: 6em;
  display: inline-block;
  vertical-align: middle;
  color: #999;
  cursor: not-allowed;
`;

const DisablePrintAgainTip = withTooltip(DisablePrintAgain);

const PrintAgain = ({ whetherAgainPrint, tips, taskCode }) => {
  let search = qs.stringify({
    taskCode,
    restart: 'yes',
  });
  search = `?${search}`;

  return whetherAgainPrint === true ? (
    <Left as={Link} to={{ pathname: '/printpreview', search }}>
      重新打印
    </Left>
  ) : (
    <DisablePrintAgainTip tip={tips}>重新打印</DisablePrintAgainTip>
  );
};

PrintAgain.propTypes = {
  whetherAgainPrint: PropTypes.bool.isRequired,
  tips: PropTypes.string.isRequired,
  taskCode: PropTypes.string.isRequired,
};

const Operate = props => {
  const { id, taskStatus, taskCode } = props.data;
  const { makeViewTaskItem, makeCancel, makeDelete } = props;

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
            <PrintAgain {...props.data} />
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
