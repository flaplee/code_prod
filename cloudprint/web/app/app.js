/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// requestAnimationFrame polyfill
import 'raf/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

import ScrollToTop from 'containers/ScrollToTop';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

import consoleColor from 'utils/consoleColor';

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

import auth from './auth';

// make DEV_LOG available
window.DEV_LOG = consoleColor;

// Create redux store with history
const initialState = {};
export const history = createHistory({
  basename: '/cloudprint/web',
});
export const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

auth(history, store);

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <ScrollToTop>
            <App />
          </ScrollToTop>
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

consoleColor.green('Running App version', process.env.VERSION);
consoleColor.purple('App env', process.env.SILV_CLOUD_ENV || 'local');
consoleColor.blue('Changelog', process.env.CHANGE_LOG);
