import { createSelector } from 'reselect';
import key from '../key';

const selectList = state => state.getIn([key, 'list']);

export const selectListIsFetching = () =>
  createSelector(
    selectList,
    list => list.get('isFetching'),
  );

export const selectListData = () =>
  createSelector(
    selectList,
    list => list.get('data'),
  );

export const selectListPage = () =>
  createSelector(
    selectList,
    list => list.get('page'),
  );

export const selectListError = () =>
  createSelector(
    selectList,
    list => list.get('error'),
  );
