import { SET_FORM, ADD_FORM } from './../constants/FormTypes';

/**
 *
 * @param {array} key
 * @param {*} value
 */
export const setForm = ({ key, value }) => ({
  type: SET_FORM,
  key,
  value,
});

/**
 *
 * @param {object} value
 * 新参数 覆盖 之前的
 */
export const addForm = value => ({
  type: ADD_FORM,
  value,
});
