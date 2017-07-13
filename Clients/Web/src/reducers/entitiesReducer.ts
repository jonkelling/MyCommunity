import merge from "lodash.merge";
import omit from "lodash.omit";
import { REHYDRATE } from "redux-persist/constants";
import * as actions from "../actions/index";

export default (state = {}, action) => {
    const resetActions = [
        actions.REMOVE_AUTH_TOKEN,
        actions.REFRESHING_TOKEN_FAILURE,
        actions.LOGOUT
    ];

    if (resetActions.some((x) => x === action.type)) {
        return {};
    }

    if (action.type === actions.CLEAR_POSTS) {
        return omit(state, "posts");
    }

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
