import { createSelector } from 'reselect';
import key from '../key';

const selectDetail = state => state.getIn([key, 'detail']);

export const makeSelectDetailIsFetching = () =>
  createSelector(
    selectDetail,
    detail => detail.get('isFetching'),
  );
