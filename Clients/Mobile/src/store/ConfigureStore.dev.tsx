// tslint:disable:no-var-requires
import { applyMiddleware, compose, createStore, Middleware, StoreEnhancer } from "redux";
const { apiMiddleware } = require("redux-api-middleware");
const normalizrMiddleware = require("redux-normalizr3-middleware").default;
// import * as createLogger from 'redux-logger';
const thunk = require("redux-thunk").default;
import rootReducer from "../reducers/index";
// import DevTools from "../containers/DevTools";
// import api from "../middleware/api";
// import auth from "../middleware/auth";
import schemas from "../schemas";

// const { apiMiddleware } = require("redux-api-middleware");

// See reducers.ts before changing anything

declare const module: any;

export default function storeConfig(preloadedState?: any) {
    const store = configureStore(
        compose(
            applyMiddleware(
                // auth,
                apiMiddleware,
                normalizrMiddleware(),
                // api,
                thunk,
                // createLogger(),
            ),
            // DevTools.instrument(),
        ),
        preloadedState,
    );

    return store;
}

function configureStore<S>(storeEnhancer: StoreEnhancer<S>, preloadedState?: any) {

    const store = createStore(
        rootReducer,
        preloadedState,
        compose(
            storeEnhancer,
            // DevTools.instrument()
        ),
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept(() => {
            const nextRootReducer = require("../reducers/index").default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
