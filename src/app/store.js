import {combineReducers, configureStore} from "@reduxjs/toolkit";

const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}

export const asyncReducers = {};

export const createStore = () => {
    const store = configureStore({
        reducer: (state, action) => {
            const combinedReducer = combineReducers({
                ...asyncReducers,
            });
            return combinedReducer(state, action);
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(stringMiddleware),
        devTools: process.env.NODE_ENV !== "production",
    });

    store.injectReducer = (key, asyncReducer) => {
        if (!asyncReducers[key]) {
            asyncReducers[key] = asyncReducer;
            store.replaceReducer((state, action) =>
                combineReducers({ ...asyncReducers })(state, action)
            );
        }
    };

    return store;
};

export const store = createStore();



