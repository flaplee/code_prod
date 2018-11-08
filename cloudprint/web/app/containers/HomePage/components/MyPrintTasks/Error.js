import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrap = styled.div`
  margin-top: 1em;
  text-align: center;
  color: red;
`;

const Error = ({ tip }) => <Wrap>{tip}</Wrap>;

Error.propTypes = {
  tip: PropTypes.string.isRequired,
};

export default Error;
