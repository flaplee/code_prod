import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fileImg from 'containers/HomePage/images/file.png';
import returnFileSize from 'utils/returnFileSize';

import media from 'style/media';

const ACCEPT = [
  'jpg',
  'jpeg',
  'png',
  'bmp',
  'gif',
  'xls',
  'xlsx',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'txt',
  'pdf',
];

const acceptArr = ACCEPT.map(item => `.${item}`);
export const accept = acceptArr.join(',');

const stringRegex = ACCEPT.join('|');
const stringRegexExt = `\\.(?:${stringRegex})$`;
export const regex = new RegExp(stringRegexExt, 'i');

const Wrap = styled.div`
  padding: 0 45px;
`;

const Box = styled.div`
  height: 360px;
  line-height: 360px;
  border: 2px dashed #5d85e0;
  text-align: center;
  transition: 0.6s;
  transform: translateY(${props => (props.dragEnter === true ? '10px' : '0')});
`;

const Center = styled.div`
  display: inline-block;
  line-height: 1.5;
  vertical-align: middle;
`;

const FileImgWrap = styled.div`
  text-align: center;
`;

const FileImg = styled.img`
  width: 60px;
`;

const Text = styled.div`
  margin-top: 15px;
  font-size: 14px;
  word-spacing: 130px;
  color: #5d85e0;
`;

const Btn = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 30px;
  padding: 0 20px;
  border-radius: 3px;
  line-height: 32px;
  font-size: 14px;
  color: #fff;
  background-color: #5d85e0;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #3464d1;
  }
`;

export const File = styled.input`
  display: none;
`;

const FileName = styled.div`
  font-size: 18px;
  color: #5d85e0;
`;

const Process = styled.div`
  position: relative;
  display: inline-block;
  width: 800px;
  ${media.extraLarge`
    width: 885px;
  `};
  height: 15px;
  margin-top: 30px;
  background-color: #eaeaea;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${props => props.num}%;
    height: 100%;
    background-color: #5d85e0;
  }
`;

const FileSize = styled.div`
  display: inline-block;
  margin-left: 15px;
  font-size: 18px;
  color: #999;
`;

const ProcessText = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #5d85e0;
`;

class UploadFile extends React.PureComponent {
  fileRef = React.createRef();

  optFile = () => {
    const fileEle = this.fileRef.current;
    // The HTMLElement.click() method simulates a mouse click on an element
    fileEle.click();
  };

  render() {
    let enterTarget = null;

    const {
      dragEnter,
      data,
      process,
      inProcess,
      onChange,
      onDrop,
      onDragLeave,
      onDragEnter,
    } = this.props;

    return (
      <Wrap>
        <Box
          dragEnter={dragEnter}
          onDragEnter={e => {
            enterTarget = e.target;
            onDragEnter();
          }}
          onDragLeave={e => {
            if (enterTarget === e.target) {
              onDragLeave();
            }
          }}
          onDrop={e => {
            e.preventDefault();
            if (process !== 0) {
              inProcess();
              return; // break
            }
            onDrop(e);
          }}
          onDragOver={e => {
            e.preventDefault();
          }}
        >
          <Center>
            {data === false ? (
              <>
                <File
                  ref={this.fileRef}
                  type="file"
                  accept={accept}
                  onChange={e => onChange(e)}
                />
                <FileImgWrap>
                  <FileImg src={fileImg} />
                </FileImgWrap>
                <Text>
                  {dragEnter === true
                    ? '释放文件即可上传'
                    : '将文件或图片拖至此处开始打印'}
                </Text>
                <Btn onClick={this.optFile}>选择文件</Btn>
              </>
            ) : (
              <>
                <FileName>{data.name}</FileName>
                <>
                  <Process num={process} />
                  <FileSize>{returnFileSize(data.size)}</FileSize>
                </>

                <ProcessText>{process}%</ProcessText>
              </>
            )}
          </Center>
        </Box>
      </Wrap>
    );
  }
}

UploadFile.propTypes = {
  data: PropTypes.any,
  dragEnter: PropTypes.bool,
  process: PropTypes.number,
  inProcess: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
};

export default UploadFile;
