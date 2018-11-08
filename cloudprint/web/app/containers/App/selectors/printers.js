import { createSelector } from 'reselect';

const selectAppPrinters = state => state.getIn(['app', 'printers']);

export const makeSelectAppPrintersIsFetching = () =>
  createSelector(selectAppPrinters, printers => printers.get('isFetching'));

export const makeSelectAppPrintersData = () =>
  createSelector(selectAppPrinters, printers => printers.get('data'));

export const makeSelectAppPrintersError = () =>
  createSelector(selectAppPrinters, printers => printers.get('error'));

export const makeSelectAppPrintersCurrent = () =>
  createSelector(selectAppPrinters, printers => printers.get('current'));

export const makeSelectAppPrintersItemFetching = () =>
  createSelector(selectAppPrinters, printers => printers.get('itemFetching'));

export const makeSelectAppPrintersItem = () =>
  createSelector(selectAppPrinters, printers => printers.get('item'));
