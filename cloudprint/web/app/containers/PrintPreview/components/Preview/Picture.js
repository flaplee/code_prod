import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Portrait from './Portrait';
import Landscape from './Landscape';

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const Picture = props => {
  const { fileId } = props;
  return (
    <Wrap>
      {fileId && <Portrait {...props} />}
      {fileId && <Landscape {...props} />}
    </Wrap>
  );
};

Picture.propTypes = {
  fileId: PropTypes.string.isRequired,
};

export default Picture;
