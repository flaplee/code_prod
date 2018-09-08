import { createStore , applyMiddleware , compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';
import DevTools from '../common/DevTools';

const configureStore = preloadedState => {
    const store = createStore(
        reducers,
        preloadedState,
        compose(
            applyMiddleware(thunk,  createLogger())
           //DevTools.instrument()
        )
    );
    return store
};

export default configureStore


