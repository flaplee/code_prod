import createHistory from 'history/createBrowserHistory';
const history = createHistory({
  basename: process.env.NODE_ENV === 'test' ? '' : '/cloudprint/web',
});
export default history;
