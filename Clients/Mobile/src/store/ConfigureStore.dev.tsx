// tslint:disable:no-var-requires
import { applyMiddleware, compose, createStore, Middleware, StoreEnhancer } from "redux";
import loginSaga from "../sagas/loginSaga";
import loggerMiddleware from "./middleware/loggerMiddleware";
const { apiMiddleware } = require("redux-api-middleware");
const normalizrMiddleware = require("redux-normalizr3-middleware").default;
const thunk = require("redux-thunk").default;
import { AsyncStorage } from "react-native";
import { autoRehydrate, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../reducers/index";
import schemas from "../schemas";
import afterNormalizrMiddleware from "./middleware/afterNormalizrMiddleware";
import apiAuthMiddleware from "./middleware/apiAuthMiddleware";
import apiEndPointMiddleware from "./middleware/apiEndPointMiddleware.dev";
import auth0CustomMiddleware from "./middleware/auth0CustomMiddleware";
import refreshTokenMiddleware from "./middleware/refreshTokenMiddleware";

const PURGE = true;

// See reducers.ts before changing anything

declare const module: any;

const sagaMiddleware = createSagaMiddleware();

export default function storeConfig(preloadedState?: any) {

    const store = configureStore(
        compose(
            applyMiddleware(
                // auth,
                auth0CustomMiddleware,
                refreshTokenMiddleware,
                apiEndPointMiddleware,
                apiAuthMiddleware,
                apiMiddleware,
                normalizrMiddleware(),
                afterNormalizrMiddleware,
                sagaMiddleware,
                // api,
                thunk,
                loggerMiddleware,
                // createLogger(),
            ),
            autoRehydrate(),
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

    sagaMiddleware.run(loginSaga, store.dispatch);

    const persistedStore = persistStore(store, { storage: AsyncStorage });

    if (PURGE) {
        persistedStore.purge();
    }

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept(() => {
            const nextRootReducer = require("../reducers/index").default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
