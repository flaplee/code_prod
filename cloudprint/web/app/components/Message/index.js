/**
 * type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Item from './Item';

const Ul = styled.ul`
  position: fixed;
  top: 90px;
  left: 50%;
  z-index: 9999;
`;

class Message extends React.PureComponent {
  ulRef = React.createRef();

  num = 0;

  componentDidUpdate() {
    // 调整位置居中
    const ulEle = this.ulRef.current;
    if (ulEle) {
      const ulWidth = ulEle.clientWidth;
      ulEle.style.marginLeft = `-${ulWidth / 2}px`;
    }
  }

  tellIsHide = () => {
    const { messages } = this.props;
    const max = messages.size;
    this.num += 1;

    if (this.num === max) {
      this.num = 0;
      this.props.clear();
    }
  };

  render() {
    const { messages } = this.props;
    if (messages.size === 0) return null;
    return (
      <Ul ref={this.ulRef}>
        {messages.map((item, i) => (
          <Item
            key={i.toString()}
            message={item}
            tellIsHide={this.tellIsHide}
          />
        ))}
      </Ul>
    );
  }
}

Message.propTypes = {
  messages: PropTypes.any.isRequired,
  clear: PropTypes.func.isRequired,
};

export default Message;
