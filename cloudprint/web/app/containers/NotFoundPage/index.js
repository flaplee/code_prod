/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from './messages';

const BackHome = styled.div``;

/* eslint-disable react/prefer-stateless-function */
export default class NotFound extends React.PureComponent {
  render() {
    return (
      <div>
        <Helmet titleTemplate="">
          <title>没找到该页面</title>
        </Helmet>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <BackHome as={Link} to="/">
          back home
        </BackHome>
      </div>
    );
  }
}
