import React from 'react';
import renderer from 'react-test-renderer';
import { accept, File, regex } from '../index';
import 'jest-styled-components';

it('renders correctly', () => {
  const tree = renderer.create(<File type="file" accept={accept} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('RegExp test result', () => {
  expect(regex.test('wwww.fdstd.com/fdf/pfdn.jpg')).toBe(true);
  expect(regex.test('wwww.fdstd.com/fdf/Doyew.JPG')).toBe(true);

  expect(regex.test('www.fdsf.com/fdf/Doyew.pdf')).toBe(true);

  expect(regex.test('wwww.fdstd.com/fdf/pfdn.xjpg')).toBe(false);
  expect(regex.test('www.fdsf.pdf/fdf/Doyew.rdd')).toBe(false);
  expect(regex.test('wwww.jpg.com/fdf/Doyew.dfd')).toBe(false);
  expect(regex.test('xls.jpg.com/fdf/Doyew.dfd')).toBe(false);

  expect(regex.test('wwww.fdstd.com/fdf/CDGn.mp4')).toBe(false);
});
