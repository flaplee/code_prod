import { createSelector } from 'reselect';
import key from './../key';

const selectForm = state => state.getIn([key, 'form']);

export const makeSelectForm = () =>
  createSelector(selectForm, form => form.toJS());

/**
 *
 * @param {array} item
 */
export const makeSelectFormItem = item =>
  createSelector(selectForm, form => form.getIn(item));
