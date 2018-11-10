import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { noScroll } = this.props.location.state || { noScroll: false };
    if (this.props.location !== prevProps.location && noScroll !== true) {
      const scroll = (this.props.location.state &&
        this.props.location.state.scroll) || [0, 0]; // default top
      window.scrollTo(scroll[0], scroll[1]);
    }
  }

  render() {
    return this.props.children;
  }
}

ScrollToTop.propTypes = {
  location: PropTypes.any,
  children: PropTypes.any,
};

export default withRouter(ScrollToTop);
