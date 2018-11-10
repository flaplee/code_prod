import { SET_SEARCH } from './../constants/SearchTypes';

const initialState = false;

export default function list(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH:
      return action.value;
    default:
      return state;
  }
}
