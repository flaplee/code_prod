import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes, ThemeProvider } from 'styled-components';

const Ul = styled.ul`
  user-select: none;
`;

// margin-right: -1px overlap next border
const Li = styled.li`
  display: inline-block;
  width: ${props => (1 / props.total) * 100}%;
  ${props =>
    props.total <= 2 &&
    css`
      margin-right: -1px;
    `};
`;

const BtnWrap = styled.div`
  padding: 0 ${props => (props.total > 2 ? '1px' : 0)};
`;

const Btn = styled.div`
  border: 1px solid ${props => props.theme.borderColor};
  text-align: center;
  color: ${props =>
    props.select === true ? props.theme.unSelectColor : props.theme.color};
  background-color: ${props =>
    props.select === true ? props.theme.bg : props.theme.unSelectBg};
  cursor: ${props => (props.select === true ? 'default' : 'pointer')};
  transition: 0.2s;
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

const SquareRadioButton = ({ theme, isFetching, list, value, makeSelect }) => {
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
      <Ul>
        {list.map((item, i) => (
          <Li
            key={i.toString()}
            total={list.length}
            onClick={() => makeSelect(item)}
          >
            <BtnWrap total={list.length}>
              <Btn select={item.value === value}>{item.name}</Btn>
            </BtnWrap>
          </Li>
        ))}
      </Ul>
    </ThemeProvider>
  );
};

SquareRadioButton.propTypes = {
  theme: PropTypes.object.isRequired,
  isFetching: PropTypes.any,
  list: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default SquareRadioButton;
