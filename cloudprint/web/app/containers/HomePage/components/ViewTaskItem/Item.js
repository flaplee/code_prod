import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// icon
import waitingImg from 'containers/HomePage/images/waiting.png';
import printingImg from 'containers/HomePage/images/printing.png';

export const SIZE = [15, 30, 20, 15, 20];

const Wrap = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
  color: #999;
  font-size: 12px;
  font-family: SimSun, serif;
`;

const Col = styled.div`
  display: inline-block;
  padding: 0 15px;
  width: ${props => props.size}%;
  vertical-align: middle;
  line-height: 1.5;
  text-align: left;
`;

const HeadWrap = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
  color: #333;
  font-weight: bold;
`;

const IndexCol = styled.div`
  display: inline-block;
  padding: 0 50px;
  width: ${props => props.size}%;
  vertical-align: middle;
  line-height: 1.5;
  text-align: left;
`;

const Img = styled.img`
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
`;

const Text = styled.div`
  display: inline-block;
  color: #999;
  margin-left: 0.5em;
  vertical-align: middle;
`;

const Waiting = () => (
  <div>
    <Img src={waitingImg} />
    <Text>等待中</Text>
  </div>
);
const Printing = () => (
  <div>
    <Img src={printingImg} />
    <Text>正在打印</Text>
  </div>
);

const CancelText = styled.div`
  color: #5d85e0;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Cancel = props => <CancelText {...props}>取消</CancelText>;

const TASK = {
  doing: {
    status: Printing,
    handle: Cancel,
  },
  wating: {
    status: Waiting,
    handle: Cancel,
  },
  confirm: {
    status: Waiting,
    handle: Cancel,
  },
  other: () => null,
};

export const Head = () => (
  <HeadWrap>
    <IndexCol size={SIZE[0]}>序列</IndexCol>
    <Col size={SIZE[1]}>任务</Col>
    <Col size={SIZE[2]}>页数</Col>
    <Col size={SIZE[3]}>状态</Col>
    <Col size={SIZE[4]}>操作</Col>
  </HeadWrap>
);

const Item = props => {
  const {
    taskCode,
    num,
    taskName,
    printPageCount,
    taskStatus,
    handleCancel,
  } = props;
  const Status = (TASK[taskStatus] && TASK[taskStatus].status) || TASK.other;
  const Handle = (TASK[taskStatus] && TASK[taskStatus].handle) || TASK.other;
  return (
    <Wrap as="li">
      <IndexCol size={SIZE[0]}>{num}</IndexCol>
      <Col size={SIZE[1]}>{taskName}</Col>
      <Col size={SIZE[2]}>{printPageCount}页</Col>
      <Col size={SIZE[3]}>
        <Status />
      </Col>
      <Col size={SIZE[4]}>
        <Handle onClick={() => handleCancel(taskCode)} />
      </Col>
    </Wrap>
  );
};

Item.propTypes = {
  num: PropTypes.number.isRequired,
  handleCancel: PropTypes.func,
  taskStatus: PropTypes.string.isRequired,
  taskCode: PropTypes.string.isRequired,
  taskName: PropTypes.string.isRequired,
  printPageCount: PropTypes.any.isRequired,
};

export default Item;
