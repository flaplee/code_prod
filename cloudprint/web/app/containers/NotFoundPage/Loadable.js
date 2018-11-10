import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
const OtherComponent = lazy(() => import('./index'));

const Loadable = ({ location }) => (
  <Suspense fallback={<LoadingIndicator />}>
    <OtherComponent location={location} />
  </Suspense>
);

Loadable.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(Loadable);
