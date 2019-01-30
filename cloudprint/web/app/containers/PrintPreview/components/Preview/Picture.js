import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Portrait from './Portrait';
import Landscape from './Landscape';
import Tip from './Tip';

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
      {fileId ? (
        <>
          <Landscape {...props} />
          <Portrait {...props} />
        </>
      ) : (
        <Tip isFetching error={false} />
      )}
    </Wrap>
  );
};

Picture.propTypes = {
  fileId: PropTypes.string.isRequired,
};

export default Picture;
