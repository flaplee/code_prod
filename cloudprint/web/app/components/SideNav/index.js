import React from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { a, b } from './hold';
import Tag from './Tag';
import sizeAdaption from './sizeAdaption';

const Wrap = styled.div`
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  float: left;
  background-color: #e3e6e5;
  z-index: 888;
`;

const Nav = styled.div`
  display: inline-block;
  width: 100%;
  padding: 15px 0;
  font-size: 14px;
  color: #333;
  line-height: 2;
  text-align: center;
  vertical-align: middle;
`;

const RightSide = styled.div`
  display: block;
`;

class SideNav extends React.Component {
  wrapRef = React.createRef();

  rightSideRef = React.createRef();

  adjustSize = () => {
    const bodyWidth = document.body.clientWidth;
    const width = sizeAdaption(bodyWidth);
    this.wrapRef.current.style.width = `${width}px`;
    this.rightSideRef.current.style.marginLeft = `${width}px`;
  };

  debounceAdjustSize = debounce(this.adjustSize, 150);

  componentDidMount() {
    this.adjustSize(); // initial
    window.addEventListener('resize', this.debounceAdjustSize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceAdjustSize, false);
  }

  render() {
    const { children } = this.props;
    return (
      <>
        <Wrap ref={this.wrapRef}>
          <Tag hold={a}>
            <Nav as={Link} to="/">
              得力云打印
            </Nav>
          </Tag>
          <Tag hold={b}>
            <Nav as={Link} to="/manageprinters">
              打印机管理
            </Nav>
          </Tag>
        </Wrap>
        <RightSide ref={this.rightSideRef}>{children}</RightSide>
      </>
    );
  }
}

SideNav.propTypes = {
  children: PropTypes.any,
};

export default SideNav;
