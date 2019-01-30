import dpi from 'constants/dpi';
import { inRange } from 'lodash';

export default width => {
  let size = {
    width: 700,
    height: 970,
    side: 90,
  };

  if (inRange(width, dpi[1680])) {
    size = {
      width: 650,
      height: 950,
      side: 80,
    };
  }

  if (inRange(width, dpi[1366])) {
    size = {
      width: 600,
      height: 900,
      side: 70,
    };
  }

  if (inRange(width, dpi[1152])) {
    size = {
      width: 550,
      height: 850,
      side: 60,
    };
  }

  if (inRange(width, dpi[1024])) {
    size = {
      width: 500,
      height: 800,
      side: 50,
    };
  }

  return size;
};
