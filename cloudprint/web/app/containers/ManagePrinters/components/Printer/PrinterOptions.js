import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dropdown from 'components/Dropdown';
import dropdownTheme from 'constants/dropdownTheme';

import media from 'style/media';

const Wrap = styled.div`
  width: 200px;
  ${media.extraLarge`
    width: 300px;
  `};
  margin: 20px 0;
  line-height: 30px;
`;

class PrinterOptions extends React.Component {
  makeSelect = item => {
    const { makeSelect } = this.props;
    makeSelect(item);
  };

  render() {
    const { current, data, isFetching } = this.props;
    const list = data
      ? data.map(item => ({ id: item.printerSn, name: item.printerName, item }))
      : false;

    const id = current ? current.printerSn : false;
    return (
      <Wrap>
        <Dropdown
          theme={dropdownTheme}
          id={id}
          list={list}
          isFetching={isFetching}
          makeSelect={value => this.makeSelect(value.item)}
        />
      </Wrap>
    );
  }
}

PrinterOptions.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  current: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default PrinterOptions;
