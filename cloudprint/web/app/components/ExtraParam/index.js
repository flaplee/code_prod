import React from 'react';
import qs from 'qs';
import history from 'utils/history';
import docCookies from 'utils/docCookies';

export default class ExtraParam extends React.Component {
  render() {
    return null;
  }

  componentDidMount() {
    /* eslint-disable */
    return;
    const cookieSearch = docCookies.getItem('search');
    const extra = qs.parse(cookieSearch.slice(1));
    const { location } = history;
    let searchObj = qs.parse(location.search.slice(1));
    searchObj = {
      ...extra, // extra 置前 只添加 不覆盖
      ...searchObj,
    };
    const search = `?${qs.stringify(searchObj)}`;
    const extraLocation = {
      ...location,
      search,
    };
    history.push(extraLocation);
  }
}
