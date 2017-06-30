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
import * as actions from "../actions/index";
import app from "./appReducer";
import edits from "./editsReducer";
import entities from "./entitiesReducer";

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

const rootReducer = combineReducers({
    app,
    edits,
    entities,
    // pagination,
    errorMessage,
});

export default rootReducer;
