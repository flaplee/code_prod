import { createSelector } from 'reselect';
import key from '../key';

const selectModal = state => state.getIn([key, 'modal']);

export const makeSelectModal = () =>
  createSelector(
    selectModal,
    modal => modal,
  );
