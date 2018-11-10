/* eslint-disable */
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
const sdk = config => {
  (function(o, s, id) {
    var js,
      fjs = o.getElementsByTagName(s)[0];
    if (o.getElementById(id)) {
      return;
    }
    js = o.createElement(s);
    js.id = id;
    js.src = process.env.SDK_WEB;
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', ' delicloud-web');
  window.deliAsyncInit = function() {
    deli.config(config);
    deli.ready(function() {});
    deli.error(function() {});
  };
};
