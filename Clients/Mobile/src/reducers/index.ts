import update from "immutability-helper";
import merge from "lodash.merge";
import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    Middleware,
} from "redux";
import { Action, handleActions } from "redux-actions";
import { REHYDRATE } from "redux-persist/constants";
import * as actions from "../actions/index";

const app = handleActions(
    {
        [REHYDRATE]: (state, action: any) => {
            const incoming = action.payload.app;
            if (incoming) { return { ...state, ...incoming, loading: { app: false } }; }
            return { ...state, loading: { app: false } };
        },
        [actions.LOGOUT]: (state) => {
            return { ...state, authToken: null };
        },
        [actions.AUTHENTICATED]: (state, action) => {
            if (action.payload) {
                return { ...state, authToken: action.payload };
            }
            return state;
        },
        [actions.REMOVE_AUTH_TOKEN]: (state, action) => {
            if (action.payload) {
                return { ...state, idToken: null, profile: null };
            }
            return state;
        },
        [actions.SET_AUTH_PROFILE]: (state, action) => {
            if (action.payload) {
                return { ...state, profile: action.payload };
            }
            return state;
        },
        [actions.SET_AUTH_TOKEN]: (state, action) => {
            if (action.payload) {
                return { ...state, ...action.payload };
            }
            return state;
        },
        REQUEST: (state, action: any) => {
            // TODO: This means there's an error.
            // if (action.payload) {
            //     return state;
            // }
            if (!action.meta) {
                return state;
            }
            const loadingKey =
                action.meta.source ||
                (
                    action.meta.schema.key ||
                    (
                        action.meta.schema.schema &&
                        action.meta.schema.schema.key
                    )
                );
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [loadingKey]: true,
                },
            };
        },
        SUCCESS: (state, action: any) => {
            if (!action.meta) {
                return state;
            }
            const loadingKey =
                action.meta.source ||
                (
                    action.meta.schema.key ||
                    (
                        action.meta.schema.schema &&
                        action.meta.schema.schema.key
                    )
                );
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [loadingKey]: false,
                },
            };
        },
        // tslint:disable-next-line:object-literal-sort-keys
        FAILURE: (state, action: any) => {
            if (!action.meta) {
                return state;
            }
            const loadingKey =
                action.meta.source ||
                (
                    action.meta.schema.key ||
                    (
                        action.meta.schema.schema &&
                        action.meta.schema.schema.key
                    )
                );
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [loadingKey]: false,
                },
            };
        },
    }, {
        loading: { app: true },
    },
);

function handleApiResponseActions(handlers) {
    return (state, action) => {
        if (!action.meta || !action.meta.source) {
            return state;
        }
        return handlers[action.meta.source](state, action);
    };
}

const entities = (state = {}, action) => {
    if (action.type === REHYDRATE) {
        const incoming = action.payload.entities;
        if (incoming) { return { ...state, ...incoming, loading: false }; }
        return { ...state, loading: false };
    }

    if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities);
    }

    return state;
};

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action: Action<any>) {
    const { type, error } = action;

    if (type === "RESETERRMSG"/*ActionTypes.RESET_ERROR_MESSAGE*/) {
        return null;
    } else if (error) {
        return action.error;
    }

    return state;
}

// Updates the pagination data for different actions.
/*const pagination = combineReducers({
    starredByUser: paginate({
        mapActionToKey: action => action.login,
        types: [
            ActionTypes.STARRED_REQUEST,
            ActionTypes.STARRED_SUCCESS,
            ActionTypes.STARRED_FAILURE
        ]
    }),
    stargazersByRepo: paginate({
        mapActionToKey: action => action.fullName,
        types: [
            ActionTypes.STARGAZERS_REQUEST,
            ActionTypes.STARGAZERS_SUCCESS,
            ActionTypes.STARGAZERS_FAILURE
        ]
    })
})*/

const rootReducer = combineReducers({
    app,
    entities,
    // pagination,
    errorMessage,
});

export default rootReducer;
