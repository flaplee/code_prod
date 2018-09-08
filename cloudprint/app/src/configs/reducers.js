// import { combineReducers } from 'redux';

import * as appRs from './reducer.app';
const {combineReducers} = require('redux');

const reducers = combineReducers(appRs);

export default reducers;
