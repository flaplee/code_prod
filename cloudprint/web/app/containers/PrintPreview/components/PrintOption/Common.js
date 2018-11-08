import styled from 'styled-components';

const size = '5.5';

export const Label = styled.div`
  float: left;
  width: ${size}em;
  padding-right: 1em;
  text-align: right;
  &::after {
    content: ':';
  }
`;

export const Options = styled.div`
  margin-left: ${size}em;
`;
