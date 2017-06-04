import merge from "lodash.merge";
import { REHYDRATE } from "redux-persist/constants";
import * as actions from "../actions/index";

export default (state = {}, action) => {
    if (action.type === actions.REMOVE_AUTH_TOKEN ||
        action.type === actions.REFRESHING_TOKEN_FAILURE) {
        return {};
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
