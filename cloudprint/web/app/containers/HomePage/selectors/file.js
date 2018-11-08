import { createSelector } from 'reselect';
import key from './../key';

const selectFile = state => state.getIn([key, 'file']);

export const makeSelectFileData = () =>
  createSelector(selectFile, file => file.get('data'));

export const makeSelectFileProcess = () =>
  createSelector(selectFile, file => file.get('process'));

export const makeSelectFileDragEnter = () =>
  createSelector(selectFile, file => file.get('dragEnter'));
