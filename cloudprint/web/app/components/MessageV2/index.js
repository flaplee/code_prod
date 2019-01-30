/**
 * type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import errorImgSrc from './images/error.png';
import successImgSrc from './images/success.png';
import warningImgSrc from './images/warning.png';
import infoImgSrc from './images/info.png';

const SRC = {
  error: errorImgSrc,
  success: successImgSrc,
  warning: warningImgSrc,
  info: infoImgSrc,
};

const Wrap = styled.ul`
  position: fixed;
  top: 90px;
  left: 50%;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  z-index: ${props => (props.show ? '8888' : '-10')};
  transform: translateY(${props => (props.show ? '0' : '-15px')});
  transition: opacity 0.3s, transform 0.3s;
`;

const Box = styled.div`
  display: inline-block;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const Img = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 0.3em;
`;

class Message extends React.PureComponent {
  ulRef = React.createRef();

  showTask = null;

  hideTask = null;

  state = {
    show: false,
  };

  show = () => {
    this.setState({
      show: true,
    });
  };

  hide = () => {
    this.setState({
      show: false,
    });
  };

  clearTasks = () => {
    clearTimeout(this.showTask);
    clearTimeout(this.hideTask);
    this.showTask = null;
    this.hideTask = null;
  };

  componentDidUpdate(prevProps) {
    // 调整位置居中
    const ulEle = this.ulRef.current;
    if (ulEle) {
      const ulWidth = ulEle.clientWidth;
      ulEle.style.marginLeft = `-${ulWidth / 2}px`;
    }

    const { message } = this.props;
    const during = message.during || 1000 * 5;
    if (prevProps.message !== message) {
      this.clearTasks();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ show: false }, cb);
    }
    function cb() {
      this.showTask = setTimeout(this.show, 200);
      this.hideTask = setTimeout(this.hide, during);
    }
  }

  componentWillUnmount() {
    this.clearTasks();
  }

  render() {
    const { message } = this.props;
    const { text, type } = message;

    const { show } = this.state;

    return (
      <Wrap show={show} ref={this.ulRef}>
        <Box>
          <Img src={SRC[type]} />
          {text}
        </Box>
      </Wrap>
    );
  }
}

Message.propTypes = {
  message: PropTypes.any.isRequired,
};

export default Message;
