import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Inkbox from 'containers/ManagePrinters/Inkbox';

import PrinterShow from './PrinterShow';
import { size } from './Inkbox';

import NoPrinter from './NoPrinter';

const Wrap = styled.div`
  padding: 0 45px;
  height: ${size}px;
  line-height: ${size}px;
  text-align: center;
`;

const PrinterBox = styled.div`
  margin-right: ${size + 20}px;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const LoadingBox = styled.div`
  height: 360px;
`;

const Info = ({ loading, data, current, makeSelect }) => {
  if (loading === true) {
    return <LoadingBox>正在加载中...</LoadingBox>;
  }

  if (data === false || data.length === 0) {
    return <NoPrinter />;
  }
  return (
    <Wrap>
      <Inkbox />
      <PrinterBox>
        <PrinterShow
          isFetching={loading}
          data={data}
          current={current}
          makeSelect={makeSelect}
        />
      </PrinterBox>
    </Wrap>
  );
};

Info.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  current: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default Info;
