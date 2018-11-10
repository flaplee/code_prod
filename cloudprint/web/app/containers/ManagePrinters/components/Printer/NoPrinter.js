import React from 'react';
import styled from 'styled-components';
import printerSrc from 'containers/ManagePrinters/images/Printer_management.png';
import noticeSrc from 'containers/HomePage/images/Notice.png';

const size = 360;
const Wrap = styled.div`
  padding: 0 45px;
  height: ${size}px;
`;

const PrinterBox = styled.div`
  height: 100%;
  line-height: ${size}px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
`;

const Center = styled.div`
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
`;

const Printer = styled.div`
  position: relative;
  display: inline-block;
  line-height: 1;
`;

const StatusImg = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
`;

const PrinterImg = styled.img`
  width: 95px;
  height: 91px;
`;

const Text = styled.div`
  margin-top: 21px;
  color: red;
`;

const NoPrinter = () => (
  <Wrap>
    <PrinterBox>
      <Center>
        <Printer>
          <PrinterImg src={printerSrc} />
          <StatusImg src={noticeSrc} />
        </Printer>

        <Text>未添加打印机，请先为组织添加设备</Text>
      </Center>
    </PrinterBox>
  </Wrap>
);

export default NoPrinter;
