const local = require('./config/local');
const sit = require('./config/sit');
const prod = require('./config/prod');

module.exports = () => {
  const env = process.env.SILV_CLOUD_ENV;
  const envOps = {
    local,
    sit,
    prod,
  };
  const op = envOps[env] || envOps.local;
  return op;
};
