import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import errorImgSrc from './images/error.png';
import successImgSrc from './images/success.png';
import warningImgSrc from './images/warning.png';
import infoImgSrc from './images/info.png';

const Li = styled.li`
  margin-top: 20px;
  font-size: 12px;
  text-align: center;
  opacity: ${props => (props.move === true ? '1' : '0')};
  transform: translateY(${props => (props.move === true ? '0' : '-15px')});
  transition: 0.3s ease-in;
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

const SRC = {
  error: errorImgSrc,
  success: successImgSrc,
  warning: warningImgSrc,
  info: infoImgSrc,
};

class Item extends React.Component {
  state = {
    move: false,
  };

  showTask = null;
  hideTask = null;
  removeTask = null;

  clearTasks = () => {
    clearTimeout(this.showTask);
    clearTimeout(this.hideTask);
    clearTimeout(this.removeTask);
    this.showTask = null;
    this.hideTask = null;
    this.removeTask = null;
  };

  render() {
    const { text, type } = this.props.message;
    const { move } = this.state;
    return (
      <Li move={move}>
        <Box>
          <Img src={SRC[type]} />
          {text}
        </Box>
      </Li>
    );
  }

  show = () => {
    this.setState({
      move: true,
    });
  };

  hide = () => {
    this.setState(
      {
        move: false,
      },
      this.tellIsHide,
    );
  };

  tellIsHide = () => {
    this.removeTask = setTimeout(() => {
      this.props.tellIsHide();
    }, 300);
  };

  componentDidMount() {
    const during = this.props.message.during || 5000;
    this.showTask = setTimeout(this.show, 200);
    this.hideTask = setTimeout(this.hide, during);
  }

  componentWillUnmount() {
    this.clearTasks();
  }
}

Item.propTypes = {
  message: PropTypes.object.isRequired,
  tellIsHide: PropTypes.func.isRequired,
};

export default Item;
