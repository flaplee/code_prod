import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { CLOSE_MODAL, REQUEST_CANCEL_TASK } from '../constants/ModalTypes';

const Wrap = styled.div`
  padding: 50px 150px 50px 150px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: #fff;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const BtnWrap = styled.div`
  display: inline-block;
  margin-top: 30px;
`;

const Btn = styled.div`
  display: inline-block;
  padding: 0 15px;
  border-radius: 3px;
  line-height: 2;
  vertical-align: middle;
  cursor: pointer;
`;

const ConfirmBtn = styled(Btn)`
  margin-right: 50px;
  color: #fff;
  background-color: #5d85e0;
`;

const CancelBtn = styled(Btn)`
  color: #5d85e0;
  border: 1px solid #5d85e0;
`;

const Cancel = ({ makeConfirm, makeClose }) => (
  <Wrap>
    <Title>是否取消打印任务?</Title>
    <BtnWrap>
      <ConfirmBtn onClick={makeConfirm}>确定</ConfirmBtn>
      <CancelBtn onClick={makeClose}>取消</CancelBtn>
    </BtnWrap>
  </Wrap>
);

Cancel.propTypes = {
  makeConfirm: PropTypes.func,
  makeClose: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => ({
  makeConfirm: () => {
    dispatch({ type: REQUEST_CANCEL_TASK });
  },
  makeClose: () => {
    dispatch({ type: CLOSE_MODAL });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cancel);
