import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'url-search-params-polyfill';

ReactDOM.render(<App />, document.getElementById('page'));