import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'components/Modal';
import { makeSelectModal } from './selectors/modal';

import { Cancel } from './Modals';

const MODALS = {
  cancel: Cancel,
  other: () => null,
};

const HomePageModal = ({ modal }) => {
  const { type } = modal;
  const ModalType = MODALS[type] || MODALS.other;
  return (
    <Modal show={type !== ''}>
      <ModalType {...modal} />
    </Modal>
  );
};
HomePageModal.propTypes = {
  modal: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  modal: makeSelectModal(),
});

export default connect(mapStateToProps)(HomePageModal);
