import { createSelector } from 'reselect';
import key from '../key';

const selectTask = state => state.getIn([key, 'task']);

export const makeSelectTaskIsFetching = () =>
  createSelector(
    selectTask,
    task => task.get('isFetching'),
  );
