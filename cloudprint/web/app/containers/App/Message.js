import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Message from 'components/Message';

import { CLEAR_MESSAGES } from 'containers/App/constants/MessagesTypes';

import { makeSelectMessages } from './selectors/messages';

const mapStateToProps = createStructuredSelector({
  messages: makeSelectMessages(),
});

const mapDispatchToProps = dispatch => ({
  clear: () => {
    dispatch({ type: CLEAR_MESSAGES });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Message);
