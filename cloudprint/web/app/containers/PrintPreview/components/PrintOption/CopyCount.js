import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import arrow01Src from 'containers/PrintPreview/images/Arrow01.png';
import arrow02Src from 'containers/PrintPreview/images/Arrow02.png';

import { Label, Options } from './Common';

const Wrap = styled.div`
  margin-top: 20px;
  line-height: 26px;
`;

const SelectBtn = styled.img`
  width: 26px;
  height: 26px;
  vertical-align: middle;
  cursor: ${props => (props.disable === true ? 'default' : 'pointer')};
  opacity: ${props => (props.disable === true ? '0.3' : '1')};
`;

const Count = styled.input`
  display: inline-block;
  width: 60px;
  height: 26px;
  margin: 0 0.5em;
  text-align: center;
  border: 1px solid #d7d7d7;
  vertical-align: middle;
  font-size: 12px;
`;

const CopyCount = ({ count, typeCopyCount, increase, decrease }) => (
  <Wrap>
    <Label>份数</Label>
    <Options>
      <SelectBtn
        disable={count <= 1}
        src={arrow01Src}
        onClick={() => decrease(count - 1)}
      />
      <Count
        type="number"
        value={count}
        onChange={e => typeCopyCount(parseInt(e.target.value, 10))}
      />
      <SelectBtn
        disable={count >= 99}
        onClick={() => increase(count + 1)}
        src={arrow02Src}
      />
    </Options>
  </Wrap>
);

CopyCount.propTypes = {
  count: PropTypes.number.isRequired,
  typeCopyCount: PropTypes.func.isRequired,
  increase: PropTypes.func.isRequired,
  decrease: PropTypes.func.isRequired,
};

export default CopyCount;
