const setConfig = require('./setConfig');

const config = setConfig();
module.exports = {
  sdkWeb: JSON.parse(config.SDK_WEB),
};
