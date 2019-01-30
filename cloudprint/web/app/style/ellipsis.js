import { css } from 'styled-components';

export default width => css`
  display: inline-block;
  max-width: ${width};
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  white-space: nowrap;
`;
