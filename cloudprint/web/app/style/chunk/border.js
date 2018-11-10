import { css } from 'styled-components';

export const top = css`
  position: relative;
  &:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: #ddd;
    transform: scaleY(0.5);
    z-index: 2;
  }
`;

export const right = css`
  position: relative;
  &:after {
    content: ' ';
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: #ddd;
    transform: scaleX(0.5);
    z-index: 2;
  }
`;

export const bottom = css`
  position: relative;
  &:after {
    content: ' ';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #ddd;
    transform: scaleY(0.5);
    z-index: 2;
  }
`;

export const left = css`
  position: relative;
  &:after {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: #ddd;
    transform: scaleX(0.5);
    z-index: 2;
  }
`;
