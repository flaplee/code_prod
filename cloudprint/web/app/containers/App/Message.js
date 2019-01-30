import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Message from 'components/MessageV2';
import { makeSelectMessages } from './selectors/messages';

const mapStateToProps = createStructuredSelector({
  message: makeSelectMessages(),
});

export default connect(mapStateToProps)(Message);
