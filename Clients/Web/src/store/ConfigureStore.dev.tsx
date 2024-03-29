﻿
import Redux, { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as createLogger from "redux-logger";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import { composeWithDevTools as devtoolsComposeWithDevTools } from "remote-redux-devtools";
// import DevTools from "../containers/DevTools";
import reducers from "../reducers/index";
import routes from "../routes";
import rootSaga from "../sagas/rootSaga";
import * as schemas from "../schemas";
import apiAuthMiddleware from "./middleware/apiAuthMiddleware";
import apiEndPointMiddleware from "./middleware/apiEndPointMiddleware.dev";
import auth0CustomMiddleware from "./middleware/auth0CustomMiddleware";

declare const module: any;

const { routerForBrowser, initializeCurrentLocation } = require("redux-little-router");
const { apiMiddleware } = require("redux-api-middleware");
const normalizrMiddleware = require("redux-normalizr3-middleware").default;

// See reducers.ts before changing anything

const littleRouter = routerForBrowser({
    // The configured routes. Required.
    routes,
    // The basename for all routes. Optional.
    // basename: '/app'
});

const routerEnhancer: Redux.StoreEnhancer<any> = littleRouter.enhancer;
const routerMiddleware: Redux.Middleware = littleRouter.middleware;

const sagaMiddleware = createSagaMiddleware();

export default (preloadedState?: any) => {
    const store = configureStore(
        compose(
            routerEnhancer,
            applyMiddleware(
                // auth,
                routerMiddleware,
                auth0CustomMiddleware,
                apiEndPointMiddleware,
                apiAuthMiddleware,
                apiMiddleware,
                normalizrMiddleware(),
                // api,
                thunk,
                sagaMiddleware,
                // createLogger()
            ),
            // DevTools.instrument()
        ),
        preloadedState
    );

    // for redux-saga
    const initialLocation = store.getState().router;
    if (initialLocation) {
        store.dispatch(initializeCurrentLocation(initialLocation));
    }

    return store;
};

function configureStore<S>(storeEnhancer: Redux.StoreEnhancer<S>, preloadedState?: any) {

    const composeEnhancers = devtoolsComposeWithDevTools({
        realtime: true,
        name: "My Community",
        host: "127.0.0.1",
        port: 8000, // the port your remotedev server is running at
    });

    const store = createStore(
        combineReducers({
            ...reducers,
            router: littleRouter.reducer,
        }),
        preloadedState,
        composeEnhancers(
            storeEnhancer,
            // DevTools.instrument()
        ),
    );

    sagaMiddleware.run(rootSaga, store.dispatch);

    // if (module.hot) {
    //     // Enable Webpack hot module replacement for reducers
    //     module.hot.accept(() => {
    //         const nextRootReducer = require("../reducers/index").default;
    //         store.replaceReducer(combineReducers({
    //             ...nextRootReducer,
    //             router: littleRouter.reducer
    //         }));
    //     });
    // }

    return store;
}
