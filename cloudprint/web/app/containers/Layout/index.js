/**
 *
 * Layout
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Switch, Redirect, Route } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from 'components/LoadingIndicator';
import SideNav from 'components/SideNav';
import RightSide from 'components/RightSide';

import HomePage from 'containers/HomePage/Loadable';
import ManagePrinters from 'containers/ManagePrinters/Loadable';
import PrintPreview from 'containers/PrintPreview/Loadable';

import { makeSelectAppAuthIsFetching } from 'containers/App/selectors/auth';

const Wrap = styled.div`
  min-height: ${window.screen.height}px;
`;

const Layout = ({ isFetching }) =>
  isFetching === true ? (
    <LoadingIndicator />
  ) : (
    <Wrap>
      <SideNav />
      <RightSide>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/manageprinters" component={ManagePrinters} />
          <Route exact path="/printpreview" component={PrintPreview} />
          <Redirect to="/notfound" />
        </Switch>
      </RightSide>
    </Wrap>
  );

Layout.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isFetching: makeSelectAppAuthIsFetching(),
});

export default connect(mapStateToProps)(Layout);
