const stringify = require("json-stringify-safe");
import { handleActions } from "redux-actions";
import * as actions from "../actions/index";

export default (state: IFileUploadsReducerState, action): IFileUploadsReducerState => {
    if (action.type === actions.REMOVE_AUTH_TOKEN) {
        return { uploadedFileNames: [] };
    }

    return handleActionsFn(state, action);
};

// tslint:disable-next-line:variable-name
function handleActionsFn(_state: IFileUploadsReducerState, _action): IFileUploadsReducerState {
    const handler = handleActions(
        {
            [actions.SUCCESS]: (state: IFileUploadsReducerState, action: any) => {
                const source =
                    action &&
                    action.meta &&
                    action.meta.source;

                if (source !== "fileUpload") {
                    return state;
                }

                return {
                    ...state,
                    uploadedFileNames: [
                        action.payload.filename
                    ],
                };
            },
            [actions.FAILURE]: (state: IFileUploadsReducerState, action: any) => {
                const source =
                    action &&
                    action.meta &&
                    action.meta.source;

                if (source !== "fileUpload") {
                    return state;
                }

                return {
                    ...state,
                    uploadedFileNames: [],
                };
            },
        }, {
            uploadedFileNames: [],
        },
    );
    return handler(_state, _action);
}

interface IFileUploadsReducerState {
    uploadedFileNames: string[];
}
