import { times } from 'lodash';
import lazyTotal from '../lazyTotal';

/**
 *
 * @param {Number}  n test times
 */
const snapshot = ({ limit, totalPage, n }) => {
  const result = times(n).map(item => {
    const config = {
      limit,
      totalPage,
      pos: item,
    };

    const lazy = lazyTotal(config);

    return {
      config,
      lazy,
    };
  });

  expect(result).toMatchSnapshot();
};

it('lazyTotal', () => {
  snapshot({
    limit: 5,
    totalPage: 15,
    n: 18,
  });
});

it('lazyTotal', () => {
  snapshot({
    limit: 5,
    totalPage: 3,
    n: 4,
  });
});

it('lazyTotal', () => {
  snapshot({
    limit: 1,
    totalPage: 10,
    n: 12,
  });
});
