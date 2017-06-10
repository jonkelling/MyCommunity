// tslint:disable:no-var-requires
const { CALL_API } = require("redux-api-middleware");
const stringify = require("json-stringify-safe");

export default (store) => (next) => (action) => {
    if (action && action === CALL_API) {
        return next(action);
    }
    if (action && action[CALL_API]) {
        const callApiAction = {
            ...action[CALL_API],
            headers: {
                ...action[CALL_API].headers,
                authorization: `Bearer ${localStorage.getItem("id_token")}`,
            },
        };
        // console.log(stringify(callApiAction));
        return next({ [CALL_API]: callApiAction });
    }
    return next(action);
};
