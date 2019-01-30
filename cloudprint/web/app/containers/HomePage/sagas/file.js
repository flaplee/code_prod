import { store } from 'app';
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';
import { authRequest, checkJson } from 'utils/request';
import apis from 'containers/HomePage/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import { regex } from 'containers/HomePage/components/UploadFile';

import { SUBMIT_FILE, UPLOAD_FILE_ERROR } from '../constants/FileTypes';

import { makeSelectFileData } from '../selectors/file';

import { setFileProcess } from '../actions/FileActions';

function* submitFile() {
  try {
    const fileData = yield select(makeSelectFileData());
    const maxSize = 1024 * 1024 * 50;
    const largeSizeTip = '暂不支持选择50.0M以上的文件';
    if (fileData.size > maxSize) throw largeSizeTip;

    const checkFileSuffix = regex.test(fileData.name);
    const invalidSuffixTip = '不支持的打印格式，请重新选择';
    if (checkFileSuffix === false) throw invalidSuffixTip;

    const data = new FormData();

    data.append('files', fileData);
    data.append('fileSource', 'web');

    const onUploadProgress = progressEvent => {
      const { loaded, total } = progressEvent;
      if (!total) return;

      const percentCompleted = Math.round((loaded * 100) / total);
      store.dispatch(setFileProcess(percentCompleted));
    };

    const timeout = 1000 * 60;

    const options = {
      method: 'POST',
      data,
      onUploadProgress,
      timeout,
    };

    const json = yield call(authRequest, apis.uploadByFile, options);
    const msg = '文件上传失败，请重新上传';
    checkJson(json, msg);

    const { id } = (json.data && json.data[0]) || { id: false };

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
