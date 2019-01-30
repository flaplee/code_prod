import qs from 'qs';
import { TOKEN, USER_ID, ORG_ID } from 'constants/cookies';

import docCookies from 'utils/docCookies';

import request from 'utils/request';
import apis from 'containers/App/apis';
import { REQUEST_AUTH, RECEIVE_AUTH } from 'containers/App/constants/AuthTypes';
import sdk from './sdk';

const checkToken = () => {
  const token = docCookies.getItem(TOKEN);
  if (!token) {
    window.location.href = `${process.env.DELICLOUD}/oa/#!apphome`;
  }
};

export default (history, store) => {
  store.dispatch({ type: REQUEST_AUTH });
  const { search } = history.location;
  const params = qs.parse(search.slice(1));

  /* eslint-disable-next-line camelcase */
  const { user_id, org_id, token } = params;

  /* eslint-disable-next-line camelcase */
  if (user_id && org_id && token) {
    const headers = {
      user_id,
      org_id,
      token,
    };
    const options = {
      headers,
    };

    docCookies.setItem(
      'search',
      `?${qs.stringify(headers)}`,
      Infinity,
      '/cloudprint/web',
    );

    request(apis.login, options)
      .then(json => {
        const { data } = json || { data: {} };
        const msg = '登陆失败';
        const cookieToken = data.token || false;
        if (cookieToken === false) throw msg;
        docCookies.setItem(TOKEN, cookieToken, Infinity, '/cloudprint/web');
        docCookies.setItem(USER_ID, user_id, Infinity, '/cloudprint/web');
        docCookies.setItem(ORG_ID, org_id, Infinity, '/cloudprint/web');
        store.dispatch({ type: RECEIVE_AUTH });
        sdk();
      })
      .catch(() => {
        window.location.href = `${process.env.DELICLOUD}/oa/#!apphome`;
      });
  } else {
    checkToken();
    store.dispatch({ type: RECEIVE_AUTH });
    sdk();
  }
};
