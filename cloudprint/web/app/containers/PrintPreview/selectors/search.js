import { createSelector } from 'reselect';
import key from './../key';

const selectSearch = state => state.getIn([key, 'search']);

export const makeSelectSearch = () =>
  createSelector(selectSearch, search => search);
