const stringify = require("json-stringify-safe");
import { handleActions } from "redux-actions";
import { REHYDRATE } from "redux-persist/constants";
import Enumerable from "../../node_modules/linq/linq";
import * as actions from "../actions/index";

export default (state, action) => {
    if (action.type === actions.REMOVE_AUTH_TOKEN) {
        return { loading: { app: false } };
    }

    let newState: any = handleActionsFn(state, action);

    if (action.payload &&
        action.payload.entities &&
        action.payload.entities.users &&
        newState &&
        newState.profile &&
        newState.profile.email) {
        console.log("finding current user...");
        const foundUser = Enumerable
            .from(action.payload.entities.users)
            .select((x) => x.value)
            .singleOrDefault((x) => x.email === newState.profile.email);
        if (foundUser) {
            newState = {
                ...newState,
                currentUser: Enumerable
                    .from(action.payload.entities.users)
                    .select((x) => x.value)
                    .singleOrDefault((x) => x.email === newState.profile.email),
            };
        }
    }

    return newState;
};

// tslint:disable-next-line:variable-name
function handleActionsFn(_state, _action) {
    const handler = handleActions(
        {
            [REHYDRATE]: (state: any, action: any) => {
                const incoming = action.payload.app;
                const extras = {
                    loading: { app: false },
                    loggingIn: false,
                    screenId: state.screenId || null,
                };
                if (incoming) {
                    return {
                        ...state,
                        ...incoming,
                        ...extras,
                    };
                }
                return {
                    ...state,
                    ...extras,
                    screenId: state.screenId || null,
                };
            },
            [actions.LOGGING_IN]: (state) => {
                return { ...state, loggingIn: true };
            },
            [actions.LOGOUT]: (state) => {
                return {
                    ...state,
                    authToken: null,
                    idToken: null,
                    profile: null,
                    currentUser: null,
                };
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
                    return {
                        ...state,
                        ...action.payload,
                        loggingIn: false,
                    };
                }
                return state;
            },
            [actions.AUTH_LOGIN_FAILED]: (state) => {
                return {
                    ...state,
                    loggingIn: false,
                };
            },
            [actions.REQUEST]: (state, action: any) => {
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
                        action.meta.schema &&
                        (
                            action.meta.schema.key ||
                            (
                                action.meta.schema.schema &&
                                action.meta.schema.schema.key
                            )
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
            [actions.SUCCESS]: (state, action: any) => {
                if (!action.meta) {
                    return state;
                }
                const loadingKey =
                    action.meta.source ||
                    (
                        action.meta.schema &&
                        (
                            action.meta.schema.key ||
                            (
                                action.meta.schema.schema &&
                                action.meta.schema.schema.key
                            )
                        )
                    );
                // console.log(`SUCCESS: ${loadingKey}`);
                return {
                    ...state,
                    loading: {
                        ...state.loading,
                        [loadingKey]: false,
                    },
                };
            },
            // tslint:disable-next-line:object-literal-sort-keys
            [actions.FAILURE]: (state, action: any) => {
                console.log(`FAILURE REDUCER...`);
                if (!action.meta) {
                    return state;
                }
                const loadingKey =
                    action.meta.source ||
                    (
                        action.meta.schema &&
                        (
                            action.meta.schema.key ||
                            (
                                action.meta.schema.schema &&
                                action.meta.schema.schema.key
                            )
                        )
                    );
                console.log(`FAILURE REDUCER: ${stringify(action)}`);
                return {
                    ...state,
                    loading: {
                        ...state.loading,
                        [loadingKey]: false,
                    },
                };
            },
            [actions.REFRESHING_TOKEN]: (state, action: any) => {
                return {
                    ...state,
                    refreshingToken: true,
                };
            },
            [actions.REFRESHING_TOKEN_SUCCESS]: (state, action: any) => {
                return {
                    ...state,
                    refreshingToken: false,
                    refreshTokenError: null,
                };
            },
            [actions.REFRESHING_TOKEN_FAILURE]: (state, action: any) => {
                return {
                    loading: { app: false },
                    refreshingToken: false,
                    refreshTokenError: action.payload,
                };
            },
            [actions.SET_SCREEN]: (state, action: any) => ({
                ...state,
                screenId: action.payload,
            }),
            [actions.WAITING_TO_LOAD_CURRENT_USER]: (state, action: any) => ({
                ...state,
                [actions.WAITING_TO_LOAD_CURRENT_USER]: action.payload,
            }),
            [actions.LOADING_CURRENT_USER_PROCESS_VALIDATED]: (state, action: any) => ({
                ...state,
                [actions.LOADING_CURRENT_USER_PROCESS_VALIDATED]: action.payload,
            }),
            [actions.GET_CURRENT_USER_SUCCESS]: (state, action: any) => {
                const userId = action.payload.result;
                const currentUser = action.payload.entities.users[userId];
                return {
                    ...state,
                    currentUser
                };
            },
        }, {
            loading: { app: true },
        },
    );
    return handler(_state, _action);
}
