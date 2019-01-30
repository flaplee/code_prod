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

const getList = arr =>
  arr.map(value => {
    switch (value) {
      case 'black':
        return {
          name: '黑白',
          value,
        };

      case 'cmyk':
        return {
          name: '彩色',
          value,
        };

      default:
        return false;
    }
  });

const PrintColorMode = ({
  printersFetching,
  itemFetching,
  item,
  value,
  makeSelect,
}) => {
  const isFetching = printersFetching === true || itemFetching === true;
  const list = (item && getList(item.printerSettings.colorTypes)) || false;
  return (
    <Wrap>
      <Label>打印颜色</Label>
      <Options>
        <SquareRadioButton
          isFetching={isFetching}
          theme={SquareTheme}
          list={list}
          value={value}
          makeSelect={makeSelect}
        />
      </Options>
    </Wrap>
  );
};

PrintColorMode.propTypes = {
  printersFetching: PropTypes.bool.isRequired,
  itemFetching: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  item: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default PrintColorMode;
