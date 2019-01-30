import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dropdown from 'components/Dropdown';
import dropdownTheme from 'constants/dropdownTheme';

import { Label, Options } from './Common';

const Wrap = styled.div`
  position: relative;
  margin: 20px 0;
  line-height: 30px;
  z-index: 2;
`;

class PrintPageSize extends React.Component {
  makeSelect = item => {
    const { makeSelect } = this.props;
    makeSelect(item);
  };

  render() {
    const { printersFetching, itemFetching, item, value } = this.props;

    const isFetching = printersFetching === true || itemFetching === true;

    const list =
      (item &&
        item.printerSettings.paperInfos &&
        item.printerSettings.paperInfos.map(s => ({
          id: s.paperType,
          name: s.paperType,
        }))) ||
      false;
    return (
      <Wrap>
        <Label>打印纸张</Label>
        <Options>
          <Dropdown
            theme={dropdownTheme}
            id={value}
            list={list}
            isFetching={isFetching}
            makeSelect={b => this.makeSelect(b.name)}
          />
        </Options>
      </Wrap>
    );
  }
}

PrintPageSize.propTypes = {
  printersFetching: PropTypes.bool.isRequired,
  itemFetching: PropTypes.bool.isRequired,
  item: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default PrintPageSize;
