import { css } from 'styled-components';

const arrowSize = 6;
const fontSize = 12;
const borderRadius = 5;

export const common = css`
  position: absolute;
  border-radius: ${borderRadius}px;
  padding: 0 0.5em;
  font-size: ${fontSize}px;
  color: ${props => props.theme.type.color};
  word-break: keep-all;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  z-index: ${props => (props.show ? '99' : '-10')};
  background-color: ${props => props.theme.type.bg};
  transition: 0.3s;
`;

const arrow = css`
  content: '';
  position: absolute;
  border-style: solid;
  width: 0;
  height: 0;
`;

export const float = css`
  ${common};
  position: fixed;
  margin-top: -${arrowSize * 3}px;
  transition: opacity 0.3s;
  &::after {
    ${arrow};
    left: 50%;
    bottom: 0;
    border-width: ${arrowSize}px ${arrowSize}px 0;
    border-color: ${props => props.theme.type.bg} transparent transparent;
    margin-bottom: -${arrowSize}px;
    margin-left: -${arrowSize}px;
  }
`;

export default {
  top: css`
    bottom: 100%;
    margin-bottom: 0.5em;
    &::after {
      ${arrow};
      left: 50%;
      bottom: 0;
      border-width: ${arrowSize}px ${arrowSize}px 0;
      border-color: ${props => props.theme.type.bg} transparent transparent;
      margin-bottom: -${arrowSize}px;
      margin-left: -${arrowSize}px;
    }
  `,
  right: css`
    left: 100%;
    margin-left: 0.5em;
    &::after {
      ${arrow};
      left: 0;
      border-width: ${arrowSize}px ${arrowSize}px ${arrowSize}px 0;
      border-color: transparent ${props => props.theme.type.bg} transparent
        transparent;
      margin-left: -${arrowSize}px;
      margin-top: -${arrowSize}px;
    }
  `,
  bottom: css`
    top: 100%;
    margin-top: 0.5em;
    &::after {
      ${arrow};
      left: 50%;
      top: 0;
      border-width: 0 ${arrowSize}px ${arrowSize}px;
      border-color: transparent transparent ${props => props.theme.type.bg};
      margin-top: -${arrowSize}px;
      margin-left: -${arrowSize}px;
    }
  `,
  left: css`
    right: 100%;
    margin-left: 0.5em;
    &::after {
      ${arrow};
      right: 0;
      border-width: ${arrowSize}px 0 ${arrowSize}px ${arrowSize}px;
      border-color: transparent transparent transparent
        ${props => props.theme.type.bg};
      margin-right: -${arrowSize}px;
      margin-top: -${arrowSize}px;
    }
  `,
};
