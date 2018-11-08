import { createSelector } from 'reselect';
import key from './../key';

const selectViewTaskItem = state => state.getIn([key, 'viewTaskItem']);

export const makeSelectViewTaskItemShow = () =>
  createSelector(selectViewTaskItem, viewTaskItem => viewTaskItem.get('show'));

export const makeSelectViewTaskItemIsFetching = () =>
  createSelector(selectViewTaskItem, viewTaskItem =>
    viewTaskItem.get('isFetching'),
  );

export const makeSelectViewTaskItemTarget = () =>
  createSelector(selectViewTaskItem, viewTaskItem =>
    viewTaskItem.get('target'),
  );

export const makeSelectViewTaskItemDetail = () =>
  createSelector(selectViewTaskItem, viewTaskItem =>
    viewTaskItem.get('detail'),
  );

export const makeSelectViewTaskItemPage = () =>
  createSelector(selectViewTaskItem, viewTaskItem => viewTaskItem.get('page'));
