import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ProcessModal from './components/ProcessModal';

import { makeSelectFileTransTipDir } from './selectors/file';

const mapStateToProps = createStructuredSelector({
  outerDirective: makeSelectFileTransTipDir(),
});

export default connect(mapStateToProps)(ProcessModal);
