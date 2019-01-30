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
    name: '速度',
    value: 300,
  },
  {
    name: '均衡',
    value: 600,
  },
  {
    name: '质量',
    value: 1200,
  },
];

const PrintDpi = ({ value, makeSelect }) => (
  <Wrap>
    <Label>打印质量</Label>
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

PrintDpi.propTypes = {
  value: PropTypes.number.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default PrintDpi;
