import { createSelector } from 'reselect';
import key from './../key';

const selectInkbox = state => state.getIn([key, 'inkbox']);

export const makeSelectInkboxIsFetching = () =>
  createSelector(selectInkbox, inkbox => inkbox.get('isFetching'));

export const makeSelectInkboxData = () =>
  createSelector(selectInkbox, inkbox => inkbox.get('data'));

export const makeSelectInkboxError = () =>
  createSelector(selectInkbox, inkbox => inkbox.get('error'));
