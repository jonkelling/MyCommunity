import { applyMiddleware, compose, createStore, Middleware, StoreEnhancer } from "redux";
import thunk from "redux-thunk";
// import auth from "../middleware/auth";
// import api from "../middleware/api";
// tslint:disable:no-var-requires
// const { routerForBrowser, initializeCurrentLocation } = require("redux-little-router");
const { apiMiddleware } = require("redux-api-middleware");
const normalizrMiddleware = require("redux-normalizr-middleware").default;
// tslint:enable:no-var-requires
// const configureStore = require("ast-app-shared/es5/store/ConfigureStore.prod").default;

// See reducers.ts before changing anything

export default (preloadedState?: any) => {
    // let routerEnhancer: StoreEnhancer<any>;
    // let routerMiddleware: Middleware;
    // const routerForBrowserValue = routerForBrowser({
    //     // The configured routes. Required.
    //     routes: require("../routes").default,
    //     // The basename for all routes. Optional.
    //     // basename: '/app'
    // });

    // routerEnhancer = routerForBrowserValue.routerEnhancer;
    // routerMiddleware = routerForBrowserValue.routerMiddleware;

    const store = createStore(
        compose(
            // routerEnhancer,
            applyMiddleware(
                // auth,
                // routerMiddleware,
                apiMiddleware,
                normalizrMiddleware(),
                // api,
                thunk,
            ),
        ),
        preloadedState,
    );

    // ...after creating your store
    const initialLocation = store.getState().router;
    if (initialLocation) {
        // store.dispatch(initializeCurrentLocation(initialLocation));
    }

    return store;
};
