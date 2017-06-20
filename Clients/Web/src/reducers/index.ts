import { Action } from "redux-actions";
import app from "./appReducer";
import edits from "./editsReducer";
import entities from "./entitiesReducer";
import fileUploads from "./fileUploadsReducer";

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

export default {
    app,
    entities,
    fileUploads,
    edits,
    // pagination,
    errorMessage,
};
