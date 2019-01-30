import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SquareRadioButton from './SquareRadioButton';
import SquareTheme from './SquareTheme';

import { Label, Options } from './Common';

const Wrap = styled.div`
  margin: 20px 0;
  line-height: 30px;
`;

const list = [
  {
    name: '横向',
    value: 1,
  },
  {
    name: '纵向',
    value: 2,
  },
];

const PrintDirection = ({ value, makeSelect }) => (
  <Wrap>
    <Label>打印方向</Label>
    <Options>
      <SquareRadioButton
        theme={SquareTheme}
        list={list}
        value={value}
        makeSelect={makeSelect}
      />
    </Options>
  </Wrap>
);

PrintDirection.propTypes = {
  value: PropTypes.number.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default PrintDirection;
