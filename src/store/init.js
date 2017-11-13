import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import thunk from 'redux-thunk';
import {resourcesReducer} from './resources';

// Enhanced createStore method for applying thunk middleware and using redux dev tools
export const createEnhancedStore = (initialState = {}) => {
    const middleware = [thunk];
    let composeEnhancers = compose;

    // If redux-dev-tools are available, use it's compose method
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }

    // Returns the created store
    return createStore(
        combineReducers({
            resources: resourcesReducer
        }),
        initialState,
        composeEnhancers(
            applyMiddleware(...middleware)
        )
    );
};