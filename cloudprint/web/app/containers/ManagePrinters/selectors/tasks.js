import { createSelector } from 'reselect';
import key from '../key';

const selectTasks = state => state.getIn([key, 'tasks']);

export const makeSelectTasksData = () =>
  createSelector(
    selectTasks,
    tasks => tasks.get('data'),
  );

export const makeSelectTasksIsFetching = () =>
  createSelector(
    selectTasks,
    tasks => tasks.get('isFetching'),
  );

export const makeSelectTasksPage = () =>
  createSelector(
    selectTasks,
    tasks => tasks.get('page'),
  );
