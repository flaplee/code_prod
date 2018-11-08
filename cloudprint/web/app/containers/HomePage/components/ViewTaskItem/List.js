import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import Empty from './Empty';
import Item from './Item';

const List = ({ isFetching, detail, handleCancel }) => {
  if (isFetching === true) return <Loading />;
  if (detail === false) return null;

  const rows = (detail && detail.rows) || [];
  if (rows.length === 0) return <Empty />;
  return rows.map((item, i) => (
    <Item
      num={i + 1}
      key={i.toString()}
      {...item}
      handleCancel={handleCancel}
    />
  ));
};

List.propTypes = {
  isFetching: PropTypes.bool,
  detail: PropTypes.any,
  handleCancel: PropTypes.func,
};

export default List;
