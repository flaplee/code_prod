import React from 'react';
import styled, { css } from 'styled-components';
import { File, accept } from 'containers/HomePage/components/UploadFile';
import apis from 'containers/HomePage/apis';
import fileImg from 'containers/HomePage/images/file.png';

const Wrap = styled.div`
  padding: 0 45px;
`;

const Box = styled.div`
  height: 360px;
  line-height: 360px;
  border: 2px dashed #5d85e0;
  text-align: center;
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

const Form = styled.form`
  display: block;
`;

const Input = styled.input`
  display: block;
`;

const Submit = styled.input`
  display: none;
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
  background-color: ${props => (props.disable ? '#ddd' : '#5d85e0')};
  transition: 0.3s;
  ${props =>
    !props.disable &&
    css`
      cursor: pointer;
      &:hover {
        background-color: #3464d1;
      }
    `}
`;

class BackwardUploadFile extends React.PureComponent {
  submitRef = React.createRef();

  render() {
    return (
      <Wrap>
        <Box>
          <Center>
            <FileImgWrap>
              <FileImg src={fileImg} />
            </FileImgWrap>
            <Btn disable>不支持ie9及以下版本</Btn>
          </Center>
        </Box>
        <Form
          action={apis.uploadByFile}
          method="post"
          encType="multipart/form-data"
        >
          <File name="files" type="file" accept={accept} />
          <Input name="fileSource" value="web" type="hidden" />
          <Submit ref={this.submitRef} type="submit" value="Submit" />
        </Form>
      </Wrap>
    );
  }
}

export default BackwardUploadFile;
