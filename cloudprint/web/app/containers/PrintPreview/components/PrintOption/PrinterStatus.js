import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import withPreloadImage from 'components/PreloadImage';
import printerSrc from 'containers/ManagePrinters/images/Printer_management.png';
import checkSrc from 'containers/HomePage/images/check.png';
import noticeSrc from 'containers/HomePage/images/Notice.png';
import loadingSrc from 'images/loading-gray-600.gif';
import printerHolderSrc from 'images/printer.png';

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
  width: 94px;
  height: 84px;
  ${props =>
    props.loading === true &&
    css`
      border: 1px solid #ddd;
    `};
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
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

const WrappedImageComponent = ({ isFetching, src, item }) => (
  <PrinterWrap>
    {isFetching === true ? (
      <>
        <Loading src={loadingSrc} />
        <Img src={printerHolderSrc} />
      </>
    ) : (
      <>
        {item && <Status src={SRC[item.onlineStatus]} />}
        <Img src={src.toString()} />
      </>
    )}
  </PrinterWrap>
);

WrappedImageComponent.propTypes = {
  isFetching: PropTypes.bool,
  src: PropTypes.any,
  item: PropTypes.any,
};

const Printer = withPreloadImage(WrappedImageComponent, printerSrc);

const PrinterStatus = ({ isFetching, item, error }) => (
  <Wrap>
    <Center>
      <Printer
        error={error}
        isFetching={isFetching}
        src={item.logo}
        item={item}
      />
      {error && <Text>{error}</Text>}
    </Center>
  </Wrap>
);
PrinterStatus.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.any.isRequired,
  error: PropTypes.any.isRequired,
};

export default PrinterStatus;
