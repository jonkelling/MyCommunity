import { handleActions } from "redux-actions";
import { REHYDRATE } from "redux-persist/constants";
import * as actions from "../actions/index";

export default handleActions(
    {
        [REHYDRATE]: (state, action: any) => {
            const incoming = action.payload.app;
            const extras = {
                loading: { app: false },
                refreshingToken: false,
                refreshTokenError: null,
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
            };
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
                ...state,
                refreshingToken: false,
                refreshTokenError: action.payload,
            };
        },
    }, {
        loading: { app: true },
    },
);
