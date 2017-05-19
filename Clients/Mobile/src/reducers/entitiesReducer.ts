import merge from "lodash.merge";
import { REHYDRATE } from "redux-persist/constants";

export default (state = {}, action) => {
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
