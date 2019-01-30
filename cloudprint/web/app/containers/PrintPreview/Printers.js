import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  setPrintersCurrent,
  requestPrinterItem,
} from 'containers/App/actions/PrintersActions';

import {
  makeSelectAppPrintersIsFetching,
  makeSelectAppPrintersData,
  makeSelectAppPrintersCurrent,
} from 'containers/App/selectors/printers';

import Printers from './components/PrintOption/Printers';

import { setForm } from './actions/FormActions';

const key = ['printerSn'];

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectAppPrintersIsFetching(),
  current: makeSelectAppPrintersCurrent(),
  list: makeSelectAppPrintersData(),
});

const mapDispatchToProps = dispatch => ({
  makeSelect: value => {
    const { printerSn } = value;
    dispatch(setPrintersCurrent(value));
    dispatch(setForm({ key, value: printerSn }));

    // 重置 打印颜色, 如果存在cmyk 默认切换到 cmyk, 否则 则切换至 black
    const { colorTypes } = value && value.printerSettings;
    const color = colorTypes.indexOf('cmyk') !== -1 ? 'cmyk' : 'black';

    dispatch(setForm({ key: ['printColorMode'], value: color }));

    dispatch(requestPrinterItem()); // put end
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Printers);
