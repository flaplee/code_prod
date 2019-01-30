import { createSelector } from 'reselect';
import key from '../key';

const selectFile = state => state.getIn([key, 'file']);

export const makeSelectFileIsFetching = () =>
  createSelector(
    selectFile,
    file => file.get('isFetching'),
  );

export const makeSelectFileTransTipDir = () =>
  createSelector(
    selectFile,
    file => file.get('transTipDir'),
  );
