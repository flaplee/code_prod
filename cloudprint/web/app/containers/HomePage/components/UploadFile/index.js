import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fileImg from 'containers/HomePage/images/file.png';

const ACCEPT = [
  '.jpg',
  '.jpeg',
  '.png',
  '.xls',
  '.doc',
  '.ppt',
  '.pdf',
  '.docx',
  '.xlsx',
  '.pptx',
  '.txt',
];

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

const BtnWrap = styled.div`
  margin-top: 30px;
  cursor: pointer;
`;

const Btn = styled.div`
  position: relative;
  display: inline-block;
  padding: 0 20px;
  border-radius: 3px;
  line-height: 32px;
  font-size: 14px;
  color: #fff;
  background-color: #5d85e0;
  transition: 0.3s;
  &:hover {
    background-color: #3464d1;
  }
`;

const File = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  left: 0;
  top: 0;
  font-size: 0;
  opacity: 0;
  cursor: pointer;
`;

const FileName = styled.div`
  font-size: 18px;
  color: #5d85e0;
`;

const Process = styled.div`
  position: relative;
  display: inline-block;
  width: 885px;
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

const UploadFile = ({
  dragEnter,
  data,
  process,
  onChange,
  onDrop,
  onDragLeave,
  onDragEnter,
}) => {
  const Content = () =>
    data === false ? (
      <>
        <FileImgWrap>
          <FileImg src={fileImg} />
        </FileImgWrap>
        <Text>
          {dragEnter === true
            ? '释放文件即可上传'
            : '将文件或图片拖至此处开始打印'}
        </Text>
        <BtnWrap>
          <Btn>
            选择文件
            <File
              type="file"
              accept={ACCEPT.join(',')}
              onChange={e => onChange(e)}
            />
          </Btn>
        </BtnWrap>
      </>
    ) : (
      <>
        <FileName>{data.name}</FileName>
        <>
          <Process num={process} />
          <FileSize>{(data.size / (1024 * 1024)).toFixed(2)}M</FileSize>
        </>

        <ProcessText>{process}%</ProcessText>
      </>
    );
  return (
    <Wrap>
      <Box
        dragEnter={dragEnter}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={e => {
          e.preventDefault();
          onDrop(e);
        }}
        onDragOver={e => {
          e.preventDefault();
        }}
      >
        <Center>
          <Content />
        </Center>
      </Box>
    </Wrap>
  );
};
UploadFile.propTypes = {
  data: PropTypes.any,
  dragEnter: PropTypes.bool,
  process: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
};

export default UploadFile;
