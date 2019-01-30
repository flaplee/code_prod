import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { times } from 'lodash';
import PAGE_SIZE from 'containers/PrintPreview/pageSizeConfig';

import leftSrc from 'containers/PrintPreview/images/left.png';
import rightSrc from 'containers/PrintPreview/images/right.png';
import rollingSrc from 'images/rolling.gif';

import Picture from './Picture';

import lazyTotal from './lazyTotal';

const SCAN_HEIGHT = 80;

const Wrap = styled.div`
  position: relative;
  display: inline-block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  vertical-align: middle;
  background-color: #dde1e5;
`;

const ScanWrap = styled.div`
  height: ${SCAN_HEIGHT}px;
  text-align: right;
  padding-right: 15px;
  padding-top: 30px;
`;

const Scan = styled.div`
  display: inline-block;
  padding: 0 15px;
  line-height: 1.5;
  font-size: 14px;
  color: ${props => (props.disable === true ? '#ccc' : '#477fff')};
  cursor: ${props => (props.disable === true ? 'default' : 'pointer')};
`;

const PageWrap = styled.div`
  text-align: center;
  font-size: 0;
`;

const PageSide = styled.div`
  display: inline-block;
  width: ${props => props.width}px;
  text-align: center;
  vertical-align: middle;
  font-size: 0;
`;

const DirectionBtn = styled.div`
  display: inline-block;
  width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  background-color: ${props => (props.disable ? '#ccc' : '#000')};
  font-size: 0;
  opacity: 0.5;
  cursor: ${props => (props.disable ? 'default' : 'pointer')};
`;

const DirectionImg = styled.img`
  width: 80%;
  height: 80%;
`;

const Page = styled.div`
  position: relative;
  display: inline-block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  vertical-align: middle;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
`;

const ImgsList = styled.div`
  position: absolute;
  left: ${props => (props.pos === 0 ? 0 : `-${props.pos}00%`)};
  top: 0;
  height: 100%;
  width: ${props => `${props.total * props.width}`}px;
  transition: left 0.5s;
`;

const ImgItem = styled.div`
  position: relative;
  display: inline-block;
  height: 100%;
  width: ${props => (1 / props.total) * 100}%;
  vertical-align: middle;
  z-index: ${props => props.num};
`;

const NumText = styled.div`
  margin-top: 30px;
  line-height: 1;
  text-align: center;
  font-size: 24px;
  color: #999;
`;

const BtnWrap = styled.div`
  margin-top: 30px;
`;

const BtnItem = styled.div`
  display: inline-block;
  width: 50%;
  text-align: center;
`;

const btn = css`
  display: inline-block;
  width: 140px;
  height: 40px;
  line-height: 40px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
`;

const CancelBtn = styled.div`
  ${btn};
  border-color: #5d85e0;
  color: #5d85e0;
`;

const SubmitBtn = styled.div`
  ${btn};
  border-color: ${props => (props.disable === true ? '#ccc' : '#5d85e0')};
  color: #fff;
  background-color: ${props => (props.disable === true ? '#ccc' : '#5d85e0')};
  ${props =>
    props.disable === true &&
    css`
      cursor: default;
    `};
  ${props =>
    props.loading === true &&
    css`
      cursor: default;
      opacity: 0.7;
    `};
  transition: 0.3s;
  &:hover {
    opacity: 0.7;
  }
`;

const Rolling = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 5px;
  vertical-align: middle;
`;

class Preview extends React.PureComponent {
  state = {
    pos: 0,
  };

  makePrev = total => {
    this.setState(prevState => ({
      pos: prevState.pos > 0 ? prevState.pos - 1 : total - 1,
    }));
  };

  makeNext = total => {
    this.setState(prevState => ({
      pos: prevState.pos < total ? prevState.pos + 1 : 0,
    }));
  };

  render() {
    const {
      size,
      search,
      paperSize,
      printDirection,
      totalPage,
      fileId,
      submit,
      scanSubmit,
      fileIsFetching,
      detailIsFetching,
      printerItemFetching,
      currentPrinter,

      taskIsFetching,
    } = this.props;

    const { pos } = this.state;

    const total = lazyTotal({
      pos,
      totalPage,
      limit: 5,
    });

    const { width: BOX_WIDTH, height: BOX_HEIGHT, side: SIDE } = size;
    const MAX_WIDTH = BOX_WIDTH - SIDE * 2;

    // paper width
    const pW = PAGE_SIZE[paperSize].paper.width;
    const pH = PAGE_SIZE[paperSize].paper.height;
    const r = pW / pH;

    const MAX_HEIGHT = MAX_WIDTH / r;

    const restart = (search && search.restart) || 'no';

    const disableBtn =
      fileIsFetching === true ||
      detailIsFetching === true ||
      printerItemFetching === true ||
      currentPrinter.onlineStatus !== '1';

    let w;
    let h;

    if (MAX_HEIGHT * r < MAX_WIDTH) {
      h = MAX_HEIGHT;
      w = h * r;
    } else {
      w = MAX_WIDTH;
      h = w / r;
    }

    w = parseInt(w, 10);
    h = parseInt(h, 10);

    return (
      <Wrap width={BOX_WIDTH} height={BOX_HEIGHT}>
        <ScanWrap>
          <Scan
            disable={disableBtn || taskIsFetching}
            onClick={() => {
              if (disableBtn || taskIsFetching) return;
              scanSubmit();
            }}
          >
            扫码打印
          </Scan>
        </ScanWrap>
        <PageWrap>
          <PageSide width={SIDE}>
            {totalPage > 1 && (
              <DirectionBtn
                disable={pos === 0}
                onClick={() => {
                  if (pos !== 0) {
                    this.makePrev(total);
                  }
                }}
              >
                <DirectionImg src={leftSrc} />
              </DirectionBtn>
            )}
          </PageSide>
          <Page width={w} height={h}>
            <ImgsList width={w} pos={pos} total={total}>
              {times(total).map((item, i) => (
                <ImgItem
                  num={pos === i ? '11' : '2'}
                  total={total}
                  key={i.toString()}
                >
                  <Picture
                    printDirection={printDirection}
                    w={w}
                    h={h}
                    imgIndex={item + 1}
                    fileId={fileId}
                  />
                </ImgItem>
              ))}
            </ImgsList>
          </Page>
          <PageSide width={SIDE}>
            {totalPage > 1 && (
              <DirectionBtn
                disable={pos === totalPage - 1}
                onClick={() => {
                  if (pos !== totalPage - 1) {
                    this.makeNext(total);
                  }
                }}
              >
                <DirectionImg src={rightSrc} />
              </DirectionBtn>
            )}
          </PageSide>
        </PageWrap>
        {fileId ? (
          <NumText>{`${pos + 1} / ${totalPage}`}</NumText>
        ) : (
          <NumText>-- / --</NumText>
        )}
        <BtnWrap>
          <BtnItem>
            <SubmitBtn
              disable={disableBtn}
              loading={taskIsFetching}
              onClick={() => {
                // 任务没准备就绪 或 任务提交中  禁止submit
                if (disableBtn || taskIsFetching) return;
                submit();
              }}
            >
              {taskIsFetching === true && <Rolling src={rollingSrc} />}
              {restart === 'yes' ? '重新打印' : '直接打印'}
            </SubmitBtn>
          </BtnItem>
          <BtnItem>
            <CancelBtn as={Link} to="/">
              取消打印
            </CancelBtn>
          </BtnItem>
        </BtnWrap>
      </Wrap>
    );
  }
}

Preview.propTypes = {
  size: PropTypes.object.isRequired,
  search: PropTypes.any.isRequired,
  paperSize: PropTypes.string.isRequired,
  printDirection: PropTypes.number.isRequired,
  totalPage: PropTypes.any.isRequired,
  fileId: PropTypes.any.isRequired,
  submit: PropTypes.func.isRequired,
  scanSubmit: PropTypes.func.isRequired,

  fileIsFetching: PropTypes.bool.isRequired,
  detailIsFetching: PropTypes.bool.isRequired,
  printerItemFetching: PropTypes.bool.isRequired,
  currentPrinter: PropTypes.any.isRequired,

  taskIsFetching: PropTypes.bool.isRequired,
};

export default Preview;
