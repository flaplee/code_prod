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

const SINGLE = [
  {
    name: '单面',
    value: 0,
  },
];

const DOUBLE = [
  ...SINGLE,
  {
    name: '双面',
    value: 1,
  },
];

const DuplexMode = ({
  printersFetching,
  itemFetching,
  item,
  paperSize,
  value,
  makeSelect,
}) => {
  const isFetching = printersFetching === true || itemFetching === true;

  const { printerSettings } = item;

  const { paperInfos } = printerSettings || { paperInfos: [] };
  const doubleArr = paperInfos.filter(info => info.paperType === paperSize);
  const double = (doubleArr[0] && doubleArr[0].double) || false;
  const list = double ? DOUBLE : SINGLE;
  return (
    <Wrap>
      <Label>打印模式</Label>
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
DuplexMode.propTypes = {
  printersFetching: PropTypes.bool.isRequired,
  itemFetching: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  item: PropTypes.any.isRequired,
  paperSize: PropTypes.string.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default DuplexMode;
