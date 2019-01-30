import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrap = styled.div`
  height: 90px;
  line-height: 90px;
  background-color: ${props => (props.select ? '#f6f6f6' : 'transparent')};
`;

class Tag extends React.Component {
  state = {
    select: false,
  };

  static getDerivedStateFromProps(props) {
    const { location, hold } = props;
    if (!hold) return null;

    const { pathname } = location;
    const select = hold.indexOf(pathname) !== -1;
    return { select };
  }

  render() {
    const { children } = this.props;
    const { select } = this.state;
    return <Wrap select={select}>{children}</Wrap>;
  }
}

Tag.propTypes = {
  children: PropTypes.any,
};

export default withRouter(Tag);
