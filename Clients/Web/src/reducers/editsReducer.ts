const stringify = require("json-stringify-safe");
import Enumerable from "linq";
import { handleActions } from "redux-actions";
import { REHYDRATE } from "redux-persist/constants";
import * as actions from "../actions/index";

export default handleActions({
    [actions.UPDATE_EDITS]: (state, action: any) => ({
        ...state,
        [action.payload.key]: {
            ...state[action.payload.key],
            ...action.payload.data
        }
    }),
    [actions.CLEAR_EDITS]: (state, action: any) => ({
        ...state,
        [action.payload.key]: null,
    }),
}, {
    },
);
