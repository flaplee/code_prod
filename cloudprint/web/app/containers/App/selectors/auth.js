import { createSelector } from 'reselect';

const selectAppAuth = state => state.getIn(['app', 'auth']);

export const makeSelectAppAuthIsFetching = () =>
  createSelector(selectAppAuth, auth => auth.get('isFetching'));
