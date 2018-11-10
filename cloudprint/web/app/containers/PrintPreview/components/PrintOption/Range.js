import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import unselectedSrc from 'containers/PrintPreview/images/unselected.png';
import choiceSrc from 'containers/PrintPreview/images/choice.png';

import { Label, Options } from './Common';

const Wrap = styled.div`
  line-height: 26px;
`;

const SelectBox = styled.img`
  width: 26px;
  height: 26px;
  vertical-align: middle;
`;

const PageSize = styled.div`
  margin-top: 20px;
`;

const Text = styled.span`
  color: #333;
  vertical-align: middle;
`;

const PrintPage = styled.input`
  display: inline-block;
  width: 60px;
  height: 26px;
  text-align: center;
  border: 1px solid #d7d7d7;
  vertical-align: middle;
`;

const WholeWrap = styled.div`
  display: block;
`;

const Range = ({
  isPrintWhole,
  makeSelectWhole,
  makeSelectPage,
  printStartPage,
  printEndPage,
  typePrintStartPage,
  typePrintEndPage,
}) => (
  <Wrap>
    <Label>打印范围</Label>
    <Options>
      <WholeWrap onClick={makeSelectWhole}>
        <SelectBox src={isPrintWhole === 0 ? unselectedSrc : choiceSrc} />
        <Text style={{ marginLeft: '0.5em' }}>全部</Text>
      </WholeWrap>
      <PageSize>
        <SelectBox
          onClick={makeSelectPage}
          src={isPrintWhole === 1 ? unselectedSrc : choiceSrc}
        />
        <Text style={{ margin: '0 0.5em' }}>页数</Text>
        <PrintPage
          type="number"
          value={printStartPage}
          onChange={e => typePrintStartPage(parseInt(e.target.value, 10))}
          disabled={isPrintWhole === 1}
        />
        <Text style={{ margin: '0 0.5em' }}>至</Text>
        <PrintPage
          type="number"
          value={printEndPage}
          onChange={e => typePrintEndPage(parseInt(e.target.value, 10))}
          disabled={isPrintWhole === 1}
        />
        <Text style={{ margin: '0 0.5em' }}>页</Text>
      </PageSize>
    </Options>
  </Wrap>
);

Range.propTypes = {
  isPrintWhole: PropTypes.number.isRequired,

  makeSelectWhole: PropTypes.func.isRequired,
  makeSelectPage: PropTypes.func.isRequired,

  printStartPage: PropTypes.number.isRequired,
  printEndPage: PropTypes.number.isRequired,

  typePrintStartPage: PropTypes.func.isRequired,
  typePrintEndPage: PropTypes.func.isRequired,
};

export default Range;
