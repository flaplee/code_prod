import { SET_MODAL, CLOSE_MODAL } from '../constants/ModalTypes';

const initialState = {
  type: '',
  tagert: false,
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case SET_MODAL:
      return action.value;

    case CLOSE_MODAL:
      return initialState;

    default:
      return state;
  }
}
