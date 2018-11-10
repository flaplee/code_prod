import sizes from 'constants/screenSizes';
import { css } from 'styled-components';

const media = Object.keys(sizes).reduce((accumulator, label) => {
  /* eslint-disable no-param-reassign */
  accumulator[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `;
  return accumulator;
}, {});

export default media;
