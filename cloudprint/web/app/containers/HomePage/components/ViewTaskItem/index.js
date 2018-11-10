import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Pagination from 'containers/HomePage/PagTaskItem';
import closeSrc from 'containers/HomePage/images/close.png';
import List from './List';
import { Head } from './Item';

const Wrap = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  z-index: ${props => (props.show ? '99' : '-10')};
  transition: 0.3s;
`;

const Box = styled.div`
  display: inline-block;
  width: 80%;
  margin-top: ${80 + 50}px;
  opacity: ${props => (props.show ? 1 : 0)};
  transform: translateY(${props => (props.show ? '0' : '-50px')});
  transition: 0.5s;
`;

const Content = styled.div`
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
`;

const Target = styled.div`
  position: relative;
  color: #333;
  line-height: 100px;
  text-align: center;
  background-color: #f6f6f6;
`;

const CloseImg = styled.img`
  position: absolute;
  right: 25px;
  top: 25px;
  width: 17px;
  height: 17px;
  cursor: pointer;
`;

const ListWrap = styled.div`
  min-height: 280px;
  padding-bottom: 30px;
  background-color: #fff;
`;

const ViewTaskItem = props => {
  const { show, target, makeClose } = props;
  return (
    <Wrap show={show}>
      <Box show={show}>
        <Content>
          <Target>
            {target.printerName}
            <CloseImg src={closeSrc} onClick={makeClose} />
          </Target>
          <Head />
          <ListWrap>
            <List {...props} />
            <Pagination />
          </ListWrap>
        </Content>
      </Box>
    </Wrap>
  );
};

ViewTaskItem.propTypes = {
  show: PropTypes.bool,
  target: PropTypes.any,
  makeClose: PropTypes.func,
};

export default ViewTaskItem;
