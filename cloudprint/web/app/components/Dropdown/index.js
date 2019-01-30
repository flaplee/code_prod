import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes, ThemeProvider } from 'styled-components';

const Wrap = styled.div`
  position: relative;
  color: ${props => props.theme.color};
  z-index: ${props => props.theme.zIndex};
  user-select: none;
`;

const pulse = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
`;

const Loading = styled.div`
  background-color: #ddd;
  opacity: 1;
  ${props =>
    props.theme.loadEffect === true &&
    css`
      animation: ${pulse} 0.3s infinite alternate;
    `};
`;

const NoneList = styled.div`
  background-color: #ddd;
`;

const NotVisibleText = styled.div`
  opacity: 0;
  visibility: hidden;
`;

const Select = styled.div`
  padding-left: 1em;
  cursor: pointer;
  background-color: ${props => props.theme.bg};
`;

const List = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  transform-origin: 0 0;
  transition: 0.3s;
  transform: scaleY(${props => (props.drop === true ? 1 : 0)});
  visibility: ${props => (props.drop === true ? 'visible' : 'hidden')};
  opacity: ${props => (props.drop === true ? 1 : 0)};
  z-index: ${props => (props.drop === true ? '2' : '-10')};
`;

const Item = styled.div`
  padding-left: 1em;
  background-color: ${props => props.theme.bg};
  cursor: pointer;
  &:hover {
    transition: 0.2s;
    background-color: ${props => props.theme.hoverBg};
  }
`;

const ArrowWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 3;
`;

const Arrow = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -3px;
  border-style: solid;
  border-color: ${props => props.theme.arrowColor} transparent transparent;
  border-width: 6px 5px 0;
  transition: 0.3s;
  transform: rotate(${props => (props.drop === true ? 0 : '90deg')});
`;

const getSelect = (list, id) => list.filter(item => item.id === id);

const getList = (list, id) => list.filter(item => item.id !== id);

class Dropdown extends React.Component {
  selectRef = React.createRef();

  listRef = React.createRef();

  state = {
    drop: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.closeAll, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeAll, false);
  }

  closeAll = e => {
    const selectEl = this.selectRef.current;
    const listEl = this.listRef.current;
    if (
      e.target !== selectEl &&
      e.target.parentNode !== listEl &&
      e.target !== listEl
    ) {
      this.setState({
        drop: false,
      });
    }
  };

  toggle = () => {
    this.setState(prevState => ({ drop: !prevState.drop }));
  };

  makeSelect = item => {
    const { makeSelect } = this.props;
    makeSelect(item);
    this.setState({
      drop: false,
    });
  };

  render() {
    const { isFetching, list, id, theme } = this.props;
    const { drop } = this.state;
    if (isFetching === true) {
      return (
        <ThemeProvider theme={theme}>
          <Loading>
            <NotVisibleText>Loading</NotVisibleText>
          </Loading>
        </ThemeProvider>
      );
    }

    if (list === false) {
      return (
        <ThemeProvider theme={theme}>
          <NoneList>
            <NotVisibleText>NoneList</NotVisibleText>
          </NoneList>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <Wrap>
          <Select ref={this.selectRef} onClick={this.toggle}>
            {id === false ? list[0].name : getSelect(list, id)[0].name}
          </Select>
          <List drop={drop} ref={this.listRef}>
            {getList(list, id).map((item, i) => (
              <Item key={i.toString()} onClick={() => this.makeSelect(item)}>
                {item.name}
              </Item>
            ))}
          </List>
          {list.length > 1 && (
            <ArrowWrap>
              <Arrow drop={drop} />
            </ArrowWrap>
          )}
        </Wrap>
      </ThemeProvider>
    );
  }
}

Dropdown.propTypes = {
  theme: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  list: PropTypes.any.isRequired,
  id: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default Dropdown;
