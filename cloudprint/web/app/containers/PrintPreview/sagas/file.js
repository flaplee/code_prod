import { takeLatest, select, call, put, cancel } from 'redux-saga/effects';

import { push } from 'react-router-redux';

import { authRequest } from 'utils/request';
import delay from '@redux-saga/delay-p';
import apis from 'containers/PrintPreview/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import { REQUEST_TASK_FILE, RECEIVE_TASK_FILE } from './../constants/TaskTypes';

import { makeSelectSearch } from './../selectors/search';

import { addForm } from './../actions/FormActions';

function* find() {
  while (true) {
    try {
      const search = yield select(makeSelectSearch());
      const { fileId } = search || {};
      const params = {
        fileId,
      };
      const method = 'post';
      const options = {
        method,
        params,
      };
      const json = yield call(authRequest, apis.findByFileId, options);
      const { code, msg } = json || { code: -1, msg: '获取数据失败' };
      if (code !== 0) throw msg;

      const {
        fileSource,
        fileName,
        fileType,
        printUrl,
        pdfMd5,
        totalPage,
        status,
      } = (json && json.data) || {
        status: 0,
      };

      const form = {
        printEndPage: totalPage,
        fileList: {
          fileSource,
          fileName,
          fileSuffix: fileType,
          printPDF: fileType === 'pdf',
          printUrl,
          printMd5: pdfMd5,
          totalPage,
          fileId,
        },
      };
      if (status === 1) {
        // 设置表单信息
        yield put(addForm(form));

        yield put({ type: RECEIVE_TASK_FILE });

        yield cancel();
      }
      if (status === -1) {
        const error = { type: 'error', text: '文件转换失败，请重新上传' };
        yield put(addMessages(error));
        yield put(push('/'));
        yield cancel();
      }
      yield delay(3 * 1000);
    } catch (e) {
      yield cancel();
      /* eslint-disable-next-line */
      console.log(e);
    }
  }
}

export default function* file() {
  yield takeLatest(REQUEST_TASK_FILE, find);
}
