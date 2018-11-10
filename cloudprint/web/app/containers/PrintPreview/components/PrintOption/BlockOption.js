import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label, Options } from './Common';

const Wrap = styled.div`
  margin-bottom: 20px;
  line-height: 30px;
`;

const Loading = styled.div`
  height: 32px;
  font-size: 0;
  background-color: #eee;
`;

const List = styled.div`
  height: 32px;
  font-size: 0;
`;

const BtnWrap = styled.div`
  display: inline-block;
  width: ${props => (1 / props.num) * 100}%;
  padding: 0 ${props => (props.num > 2 ? '1px' : 0)};
`;

const Btn = styled.div`
  border: 1px solid #5d85e0;
  text-align: center;
  font-size: 12px;
  color: ${props => (props.select === true ? '#fff' : '#5d85e0')};
  background-color: ${props =>
    props.select === true ? '#5d85e0' : 'transparent'};
  cursor: pointer;
`;

const BlockOption = ({ isFetching, label, value, list, makeSelect }) => {
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
    <Wrap>
      <Label>{label}</Label>
      <Options>
        <List>
          {list.map((item, i) => (
            <BtnWrap key={i.toString()} num={list.length}>
              <Btn
                select={item.value === value}
                onClick={() => {
                  makeSelect(item.value);
                }}
              >
                {item.name}
              </Btn>
            </BtnWrap>
          ))}
        </List>
      </Options>
    </Wrap>
  );
};
BlockOption.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  list: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default BlockOption;
