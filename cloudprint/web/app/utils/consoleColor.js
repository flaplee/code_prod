/* eslint-disable no-console, indent */
const COLORS = {
  blue: ['#1E88E5', '#90CAF9'],
  brown: ['#6D4C41', '#D7CCC8'],
  gray: ['#212121', '#BDBDBD'],
  green: ['#388E3C', '#A5D6A7'],
  red: ['#E53935', '#EF9A9A'],
  orange: ['#F4511E', '#FFAB91'],
  purple: ['#8E24AA', '#E1BEE7'],
  yellow: ['#FFD600', '#FFF59D'],
};

const print = Object.entries(COLORS).reduce(
  (api, [name, colors]) => ({
    [name]: (shortLabel, longerMessage, optionalSuffix = '') =>
      console.log(
        `%c${shortLabel}%c${longerMessage}%c${optionalSuffix}`,
        `background-color: ${
          colors[0]
        }; color: #fff; padding: 2px 4px; font-weight: bold;`,
        `background-color: ${colors[1]}; color: #000; padding: 2px 4px;`,
        optionalSuffix !== ''
          ? `background-color: ${
              colors[0]
            }; color: #fff; padding: 2px 4px; font-weight: bold;`
          : '',
      ),
    ...api,
  }),
  {},
);

const disablePrint = Object.entries(COLORS).reduce(
  (api, [name]) => ({
    [name]: () => {},
    ...api,
  }),
  {},
);

const Log = process.env.SILV_CLOUD_ENV === 'prod' ? disablePrint : print;

export default Log;
