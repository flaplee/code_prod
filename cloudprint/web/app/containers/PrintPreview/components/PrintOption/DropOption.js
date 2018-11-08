import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Label, Options } from './Common';

const Wrap = styled.div`
  position: relative;
  margin: 20px 0;
  line-height: 30px;
  z-index: ${props => (props.drop === true ? 10 : 1)};
`;

const DropBox = styled.div`
  position: relative;
  padding: 0 15px;
  background-color: #e4edff;
  cursor: pointer;
`;

const Value = styled.div`
  display: inline-block;
  color: #333;
  vertical-align: middle;
`;

const Loading = styled.div`
  display: inline-block;
  width: 100%;
  height: 30px;
  vertical-align: middle;
  background-color: #eee;
`;

const ArrowWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Arrow = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -3px;
  border-style: solid;
  border-color: #333 transparent transparent;
  border-width: 6px 5px 0;
  transition: 0.3s;
  transform: rotate(${props => (props.drop === true ? 0 : '90deg')});
`;

const List = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  transform-origin: 0 0;
  transition: 0.3s;
  transform: scaleY(${props => (props.drop === true ? 1 : 0)});
`;

const Item = styled.div`
  padding: 0 15px;
  background-color: #e4edff;
  &:hover {
    background-color: #cedaf6;
  }
`;

class DropOption extends React.PureComponent {
  state = {
    drop: false,
  };

  toggle = () => {
    document.addEventListener('click', this.closeAll, false);
    this.setState(prevState => ({ drop: !prevState.drop }));
  };

  closeAll = () => {
    document.removeEventListener('click', this.closeAll, false);
    this.setState({
      drop: false,
    });
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.closeAll, false);
  }

  render() {
    const { label, isFetching, list, value, makeSelect } = this.props;
    const { drop } = this.state;
    if (isFetching === true) {
      return (
        <Wrap>
          <Label>{label}</Label>
          <Options>
            <Loading />
          </Options>
        </Wrap>
      );
    }

    if (list === false || list.length === 0) return null;

    return (
      <Wrap drop={drop}>
        <Label>{label}</Label>
        <Options>
          <DropBox onClick={this.toggle}>
            <Value>{value}</Value>
            <ArrowWrap>
              <Arrow drop={drop} />
            </ArrowWrap>
            <List drop={drop}>
              {list.filter(item => item !== value).map((item, i) => (
                <Item onClick={() => makeSelect(item)} key={i.toString()}>
                  {item}
                </Item>
              ))}
            </List>
          </DropBox>
        </Options>
      </Wrap>
    );
  }
}

DropOption.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  makeSelect: PropTypes.func.isRequired,
  list: PropTypes.any.isRequired,
};

export default DropOption;
