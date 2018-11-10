import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loading from './Loading';
import Item from './Item';
import Empty from './Empty';
import Error from './Error';

const Ul = styled.ul`
  font-family: SimSun, serif;
`;

const List = ({ error, isFetching, data, ...props }) => {
  if (isFetching === true) return <Loading />;
  if (error !== false) {
    return <Error tip={error} />;
  }
  if (data === false) return null;
  if (data.rows.length === 0) return <Empty />;
  const renderList = (item, i) => <Item key={i} {...item} {...props} />;
  return <Ul>{data.rows.map(renderList)}</Ul>;
};

List.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  error: PropTypes.any.isRequired,
};

export default List;
