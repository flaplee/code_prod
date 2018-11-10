import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import UploadFile from './components/UploadFile';

import {
  SUBMIT_FILE,
  FILE_DRAGENTER,
  FILE_DRAGLEAVE,
} from './constants/FileTypes';

import {
  makeSelectFileData,
  makeSelectFileProcess,
  makeSelectFileDragEnter,
} from './selectors/file';

import { setFileData } from './actions/FileActions';

const mapStateToProps = createStructuredSelector({
  data: makeSelectFileData(),
  process: makeSelectFileProcess(),
  dragEnter: makeSelectFileDragEnter(),
});

const mapDispatchToProps = dispatch => ({
  onChange: e => {
    const { files } = e.target;
    dispatch(setFileData(files[0]));
    dispatch({ type: SUBMIT_FILE });
  },

  onDrop: e => {
    const { files } = e.dataTransfer;
    dispatch(setFileData(files[0]));
    dispatch({ type: SUBMIT_FILE });
  },

  onDragEnter: () => {
    dispatch({ type: FILE_DRAGENTER });
  },

  onDragLeave: () => {
    dispatch({ type: FILE_DRAGLEAVE });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadFile);
