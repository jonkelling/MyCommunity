import * as actions from "./actions/index";

export default {
    updateEdits: (key: string, data) => ({
        type: actions.UPDATE_EDITS,
        payload: {
            data,
            key,
        }
    }),
    clearEdits: (key: string) => ({
        type: actions.CLEAR_EDITS,
        payload: {
            key
        }
    }),
};
