import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment';

// icon
import waitingImg from 'containers/HomePage/images/waiting.png';
import NoticeImg from 'containers/HomePage/images/Notice.png';
import checkImg from 'containers/HomePage/images/check.png';
import deleteImg from 'containers/HomePage/images/delete.png';
import printingImg from 'containers/HomePage/images/printing.png';
import NotBeginningImg from 'containers/HomePage/images/Not_beginning.png';

import Operate from 'containers/HomePage/Operate';

const STATUS = {
  confirm: {
    text: '等待中',
    icon: waitingImg,
  },
  wating: {
    text: '等待中',
    icon: waitingImg,
  },
  fail: {
    text: '打印失败',
    icon: NoticeImg,
  },
  success: {
    text: '打印成功',
    icon: checkImg,
  },
  cancel: {
    text: '已取消',
    icon: deleteImg,
  },
  doing: {
    text: '正在打印',
    icon: printingImg,
  },
  create: {
    text: '未开始',
    icon: NotBeginningImg,
  },
};

export const SIZE = [25, 20, 20, 15, 20];

const Li = styled.li`
  padding: 10px 30px;
  border-bottom: 1px solid #ddd;
  line-height: 40px;
  text-align: left;
  font-size: 12px;
  color: #999;
`;

const Col = styled.div`
  display: inline-block;
  padding: 0 15px;
  width: ${props => props.size}%;
  vertical-align: middle;
  line-height: 1.3;
  word-break: break-all;
  color: ${props => props.theme.color};
  ${props =>
    props.bold &&
    css`
      font-weight: bold;
    `};
`;

const StatusImg = styled.img`
  width: 16px;
  height: 16px;
  vertical-align: middle;
`;

const StatusText = styled.span`
  margin-left: 0.5em;
  vertical-align: middle;
`;

const Item = props => {
  const { taskName, printerName, taskStatus, createTime } = props;
  return (
    <Li>
      <Col size={SIZE[0]}>{taskName}</Col>
      <Col size={SIZE[1]}>{printerName}</Col>
      <Col size={SIZE[2]}>{moment(createTime).format('YYYY-MM-DD HH:mm')}</Col>
      {STATUS[taskStatus] && (
        <Col size={SIZE[3]}>
          <StatusImg src={STATUS[taskStatus].icon} />
          <StatusText>{STATUS[taskStatus].text}</StatusText>
        </Col>
      )}
      <Col size={SIZE[4]}>
        <Operate data={props} />
      </Col>
    </Li>
  );
};

Item.propTypes = {
  taskName: PropTypes.string.isRequired,
  printerName: PropTypes.string.isRequired,
  taskStatus: PropTypes.string.isRequired,
  createTime: PropTypes.number.isRequired,
};

export default Item;
