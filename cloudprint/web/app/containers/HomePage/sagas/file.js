import { store } from 'app';
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/HomePage/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import { SUBMIT_FILE, UPLOAD_FILE_ERROR } from './../constants/FileTypes';

import { makeSelectFileData } from './../selectors/file';

import { setFileProcess } from './../actions/FileActions';

function* submitFile() {
  try {
    const fileData = yield select(makeSelectFileData());
    const data = new FormData();

    data.append('files', fileData);
    data.append('fileSource', 'web');

    const onUploadProgress = progressEvent => {
      const { loaded, total } = progressEvent;
      if (!total) return;

      const percentCompleted = Math.round((loaded * 100) / total);
      store.dispatch(setFileProcess(percentCompleted));
    };

    const options = {
      method: 'POST',
      data,
      onUploadProgress,
    };

    const json = yield call(authRequest, apis.uploadByFile, options);
    const msg = '文件上传失败，请重新上传';
    checkJson(json, msg);

    const { id } = json.data[0] || {
      data: [{}],
    };

    const success = { type: 'success', text: '文件已经上传成功, 请预览' };
    yield put(addMessages(success));

    yield put(push(`/printpreview?fileId=${id}`));
  } catch (e) {
    const error = {
      type: 'error',
      text: typeof e === 'string' ? e : '文件上传失败，请重新上传',
    };
    yield put(addMessages(error));
    yield put({ type: UPLOAD_FILE_ERROR });
  }
}

export default function* file() {
  yield takeLatest(SUBMIT_FILE, submitFile);
}
