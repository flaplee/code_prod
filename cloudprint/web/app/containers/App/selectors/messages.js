import { createSelector } from 'reselect';

const selectApp = state => state.getIn(['app', 'messages']);

export const makeSelectMessages = () =>
  createSelector(selectApp, messages => messages);
