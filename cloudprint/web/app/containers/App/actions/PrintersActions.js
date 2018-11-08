import {
  REQUEST_PRINTERS,
  RECEIVE_PRINTERS,
  ERROR_PRINTERS,
  SET_PRINTERS_CURRENT,
  REQUEST_PRINTERS_ITEM,
  RECEIVE_PRINTERS_ITEM,
} from '../constants/PrintersTypes';

export const requestPrinters = () => ({
  type: REQUEST_PRINTERS,
});

export const receivePrinters = json => ({
  type: RECEIVE_PRINTERS,
  value: json.data.rows,
});

export const loadPrintersError = value => ({
  type: ERROR_PRINTERS,
  value,
});

export const setPrintersCurrent = value => ({
  type: SET_PRINTERS_CURRENT,
  value,
});

export const requestPrinterItem = () => ({
  type: REQUEST_PRINTERS_ITEM,
});

export const receivePrinterItem = json => ({
  type: RECEIVE_PRINTERS_ITEM,
  value: json.data,
});
