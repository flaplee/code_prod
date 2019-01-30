import React from 'react';
import styled from 'styled-components';
import printerSrc from 'containers/ManagePrinters/images/Printer_management.png';
import checkSrc from 'containers/HomePage/images/check.png';
import noticeSrc from 'containers/HomePage/images/Notice.png';
import PrinterOptions from './PrinterOptions';
import PrinterInfo from './PrinterInfo';

const Wrap = styled.div`
  display: inline-block;
  text-align: left;
`;

const Printer = styled.div`
  position: relative;
  display: inline-block;
  line-height: 1;
`;

const PrinterImg = styled.img`
  width: 95px;
  height: 91px;
`;

const StatusImg = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
`;

const InfoWrap = styled.div`
  display: inline-block;
  margin-left: 31px;
  line-height: 1;
  vertical-align: middle;
`;

export default props => (
  <Wrap>
    <Printer>
      <PrinterImg src={printerSrc} />
      <StatusImg
        src={props.current.onlineStatus === '1' ? checkSrc : noticeSrc}
      />
    </Printer>
    <InfoWrap>
      <PrinterOptions {...props} />
      <PrinterInfo {...props} />
    </InfoWrap>
  </Wrap>
);
