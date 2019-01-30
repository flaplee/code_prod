import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrap = styled.div`
  margin-top: 15px;
  font-family: SimSun, serif;
  color: #999;
`;

const Text = styled.div`
  line-height: 1;
  color: #ccc;
`;

const PrinterInfo = ({ current }) => (
  <Wrap>
    <Text>SN：{current.printerSn}</Text>
    {current.onlineStatus === '1' && (
      <Text style={{ marginTop: '10px' }}>IP：{current.printerIp}</Text>
    )}
  </Wrap>
);

PrinterInfo.propTypes = {
  current: PropTypes.any.isRequired,
};

export default PrinterInfo;
