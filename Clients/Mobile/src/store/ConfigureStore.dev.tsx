import { applyMiddleware, compose, createStore, Middleware, StoreEnhancer } from "redux";
// import * as createLogger from 'redux-logger';
import thunk from "redux-thunk";
import rootReducer from "../reducers/index";
// import DevTools from "../containers/DevTools";
// import api from "../middleware/api";
// import auth from "../middleware/auth";
import * as schemas from "../schemas";

// tslint:disable:no-var-requires
const { apiMiddleware } = require("redux-api-middleware");
const normalizrMiddleware = require("redux-normalizr-middleware").default;
// tslint:enable:no-var-requires

// See reducers.ts before changing anything

declare const module: any;

export default (preloadedState?: any) => {
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
};

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
        module.hot.accept("../reducers/index", () => {
            const nextRootReducer = require("../reducers/index").default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
