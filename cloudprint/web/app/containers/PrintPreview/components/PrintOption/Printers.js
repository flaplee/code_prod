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
  z-index: 3;
`;

class Printers extends React.Component {
  makeSelect = item => {
    const { makeSelect } = this.props;
    makeSelect(item);
  };

  render() {
    const { current, list, isFetching } = this.props;

    const data = list
      ? list.map(item => ({ id: item.printerSn, name: item.printerName, item }))
      : false;

    const id = current ? current.printerSn : false;
    return (
      <Wrap>
        <Label>打印机</Label>
        <Options>
          <Dropdown
            theme={dropdownTheme}
            id={id}
            list={data}
            isFetching={isFetching}
            makeSelect={value => this.makeSelect(value.item)}
          />
        </Options>
      </Wrap>
    );
  }
}

Printers.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  current: PropTypes.any.isRequired,
  list: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default Printers;
