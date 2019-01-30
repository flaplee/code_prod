import { SET_FILE_DATA, SET_FILE_PROCESS } from '../constants/FileTypes';

export const setFileData = value => ({
  type: SET_FILE_DATA,
  value,
});

export const setFileProcess = value => ({
  type: SET_FILE_PROCESS,
  value,
});
