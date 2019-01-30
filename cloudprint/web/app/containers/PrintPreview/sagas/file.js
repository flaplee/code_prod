import { takeLatest, select, call, put, cancel } from 'redux-saga/effects';

import { push } from 'connected-react-router/immutable';

import { authRequest, checkJson } from 'utils/request';
import delay from '@redux-saga/delay-p';
import apis from 'containers/PrintPreview/apis';

import { addMessages } from 'containers/App/actions/MessagesActions';

import { REQUEST_TASK_FILE, RECEIVE_TASK_FILE } from '../constants/TaskTypes';

import { makeSelectSearch } from '../selectors/search';

import { addForm } from '../actions/FormActions';

import { setFileTransTipDir } from '../actions/FileActions';
import directive from '../components/ProcessModal/directive';

const DURING = 1000 * 3;

function* find() {
  const { activate, deactivateWithClose } = directive;
  yield put(setFileTransTipDir(activate));
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
      checkJson(json);

      const {
        fileSource,
        fileName,
        fileType,
        printUrl,
        pdfMd5,
        totalPage,
        status,
        id,
      } = (json && json.data) || { status: -1 };

      // status is first priority to handing error
      if (status === -1) {
        const error = { type: 'error', text: '文件转换失败，请重新上传' };
        yield put(addMessages(error));
        yield put(push('/'));
        yield cancel();
      }

      // 临时处理后端未完善的数据
      const stringReg = `^${id}_`;
      const reg = new RegExp(stringReg);

      const form = {
        printEndPage: totalPage,
        fileList: {
          fileSource,
          fileName: fileName.replace(reg, ''),
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

        yield put(setFileTransTipDir(deactivateWithClose));

        yield cancel();
      }

      yield delay(DURING);
    } catch (e) {
      // console.log(e);
      yield delay(DURING);
    }
  }
}

export default function* file() {
  yield takeLatest(REQUEST_TASK_FILE, find);
}
