import dpi from 'constants/dpi';
import { inRange } from 'lodash';

export default width => {
  let size = 120;

  if (inRange(width, dpi[1440])) {
    size = 50;
  }
  return size;
};
