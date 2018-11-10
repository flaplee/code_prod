import React from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import Loading from './Loading';
import Empty from './Empty';

const List = ({ isFetching, data, handleCancel }) => {
  if (isFetching === true) return <Loading />;
  if (data === false || data.rows.length === 0) return <Empty />;
  return (
    <ul>
      {data.rows.map((item, i) => (
        <Item
          num={i + 1}
          key={i.toString()}
          {...item}
          handleCancel={handleCancel}
        />
      ))}
    </ul>
  );
};
List.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default List;
