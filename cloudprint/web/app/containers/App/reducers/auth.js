import { fromJS } from 'immutable';

import { REQUEST_AUTH, RECEIVE_AUTH } from '../constants/AuthTypes';

const initialState = fromJS({
  isFetching: false,
});

export default function auth(state = initialState, action) {
  switch (action.type) {
    case REQUEST_AUTH:
      return state.set('isFetching', true);

    case RECEIVE_AUTH:
      return state.set('isFetching', false);

    default:
      return state;
  }
}
