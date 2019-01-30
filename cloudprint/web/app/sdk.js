import axios from 'axios';
import apis from 'containers/App/apis';

export default () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const nonceStr = '32132323213232132';
  const params = {
    timestamp,
    nonceStr,
  };
  const options = {
    params,
  };
  axios(apis.config, options)
    .then(response => {
      const { data } = response.data || { data: {} };
      const { signStr, appId } = data;
      const signature = signStr;
      const noncestr = nonceStr;
      const config = {
        appId,
        noncestr,
        timestamp,
        signature,
      };
      sdk(config);
    })
    .catch(e => {
      /* eslint-disable-next-line no-console */
      console.log(e);
    });
};

/* eslint-disable */
const sdk = config => {
  const runDeli = () => {
    deli.config(config);
    deli.ready(function() {});
    deli.error(function() {});
  };
  if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', runDeli);
  } else {
    // `DOMContentLoaded` has already fired
    runDeli();
  }
};
