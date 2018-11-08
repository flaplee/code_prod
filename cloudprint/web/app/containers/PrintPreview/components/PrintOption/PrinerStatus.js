import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import printerSrc from 'containers/ManagePrinters/images/Printer_management.png';
import checkSrc from 'containers/HomePage/images/check.png';
import noticeSrc from 'containers/HomePage/images/Notice.png';
import loadingSrc from 'images/loading-gray-600.gif';

const Wrap = styled.div`
  margin-top: 100px;
  text-align: center;
`;

const Center = styled.div`
  display: inline-block;
  line-height: 1;
`;

const PrinterWrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Printer = styled.img`
  width: 94px;
  height: 84px;
`;

const Status = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
`;

const Loading = styled.img`
  position: absolute;
  right: -10px;
  top: -10px;
  width: 50px;
  height: 50px;
`;

const Text = styled.div`
  margin-top: 10px;
  color: red;
  font-size: 16px;
`;

const SRC = {
  '0': noticeSrc,
  '1': checkSrc,
};

const PrinerStatus = ({ isFetching, current, error }) => (
  <Wrap>
    <Center>
      <PrinterWrap>
        <Printer src={printerSrc} />
        {isFetching === true ? (
          <Loading src={loadingSrc} />
        ) : (
          current && <Status src={SRC[current.onlineStatus]} />
        )}
      </PrinterWrap>
      {error && <Text>{error}</Text>}
    </Center>
  </Wrap>
);

PrinerStatus.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  current: PropTypes.any.isRequired,
  error: PropTypes.any.isRequired,
};

export default PrinerStatus;
