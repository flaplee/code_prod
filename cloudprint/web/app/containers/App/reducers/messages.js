import { List } from 'immutable';

import { ADD_MESSAGES, CLEAR_MESSAGES } from '../constants/MessagesTypes';

const initialState = List();

export default function messages(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGES:
      return action.value;

    case CLEAR_MESSAGES:
      return state.clear();

    default:
      return state;
  }
}
