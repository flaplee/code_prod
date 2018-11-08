import React from 'react';
import styled from 'styled-components';

import PrintDirection from 'containers/PrintPreview/PrintDirection';
import DuplexMode from 'containers/PrintPreview/DuplexMode';
import PrintDpi from 'containers/PrintPreview/PrintDpi';
import PrintColorMode from 'containers/PrintPreview/PrintColorMode';

import Printers from 'containers/PrintPreview/Printers';
import PrintPageSize from 'containers/PrintPreview/PrintPageSize';

import Range from 'containers/PrintPreview/Range';
import CopyCount from 'containers/PrintPreview/CopyCount';

const Wrap = styled.div`
  position: relative;
  margin-top: 60px;
`;

const Form = () => (
  <Wrap>
    <Printers />
    <PrintPageSize />
    <PrintDirection />
    <DuplexMode />
    <PrintDpi />
    <PrintColorMode />
    <Range />
    <CopyCount />
  </Wrap>
);

export default Form;
