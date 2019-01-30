/**
 * 不使用state, componentDidUpdate处理会更简单
 * when open must deactivateTip
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import directive from './directive';

const Wrap = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  visibility: hidden;
  opacity: 0;
  z-index: -10;
  transition: 0.3s;
`;

const Box = styled.div`
  display: inline-block;
  margin-top: ${100 + 80}px;
  opacity: 0;
  transform: translateY(-50px);
  transition: 0.5s;
`;

const Content = styled.div`
  padding: 60px 80px 40px 80px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Title = styled.div`
  margin-bottom: 30px;
  font-size: 18px;
  line-height: 1;
  color: #333;
`;

const btn = css`
  display: inline-block;
  margin: 0 15px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
  transition: 0.3s;
  cursor: pointer;
`;

const Cancel = styled.div`
  ${btn};
  color: #999;
  border: 1px solid #eaeaea;
`;

const Confirm = styled.div`
  ${btn};
  color: #fff;
  background-color: #5d85e0;
`;

const INTERVAL_DURING =
  process.env.NODE_ENV === 'production' ? 1000 * 20 : 1000 * 3;

class ProcessModal extends React.PureComponent {
  wrapRef = React.createRef();

  boxRef = React.createRef();

  intervalTask = null;

  clearIntervalTask = () => {
    if (this.intervalTask !== null) {
      clearInterval(this.intervalTask);
      this.intervalTask = null;
    }
  };

  open = () => {
    this.deactivateTip();
    const wrapEle = this.wrapRef.current;
    const boxEle = this.boxRef.current;

    if (!wrapEle || !boxEle) return;

    wrapEle.style.cssText = `
      visibility:visible;
      opacity:1;
      z-index: 9999;
    `;

    const y = 0;
    boxEle.style.cssText = `
      opacity: 1;
      -ms-transform: translateY(${y});
      -moz-transform: translateY(${y});
      -webkit-transform: translateY(${y});
      transform: translateY(${y});
    `;
  };

  close = () => {
    const wrapEle = this.wrapRef.current;
    const boxEle = this.boxRef.current;

    if (!wrapEle || !boxEle) return;

    wrapEle.style.cssText = `
      visibility: hidden;
      opacity: 0;
      z-index: -10;
    `;
    const y = '-50px';
    boxEle.style.cssText = `
      opacity: 0;
      -ms-transform: translateY(${y});
      -moz-transform: translateY(${y});
      -webkit-transform: translateY(${y});
      transform: translateY(${y});
    `;
  };

  activateTip = () => {
    this.intervalTask = setInterval(this.open, INTERVAL_DURING);
  };

  deactivateTip = () => {
    this.clearIntervalTask();
  };

  deactivateTipWithClose = () => {
    this.clearIntervalTask();
    this.close();
  };

  makeConfirm = () => {
    this.activateTip();
    this.close();
  };

  componentDidMount() {}

  componentWillUnmount() {
    this.clearIntervalTask();
  }

  componentDidUpdate() {
    const { outerDirective } = this.props;
    const { activate, deactivateWithClose } = directive;

    switch (outerDirective) {
      case activate:
        this.activateTip();
        break;

      case deactivateWithClose:
        this.deactivateTipWithClose();
        break;

      default:
        break;
    }
  }

  render() {
    return (
      <Wrap ref={this.wrapRef}>
        <Box ref={this.boxRef}>
          <Content>
            <Title>文件转换超时，是否继续等待</Title>
            <Confirm onClick={this.makeConfirm}>继续</Confirm>
            <Cancel as={Link} to="/">
              取消
            </Cancel>
          </Content>
        </Box>
      </Wrap>
    );
  }
}

ProcessModal.propTypes = {
  outerDirective: PropTypes.string.isRequired,
};

export default ProcessModal;
