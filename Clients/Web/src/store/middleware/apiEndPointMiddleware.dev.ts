// tslint:disable:no-var-requires
import stringify from "json-stringify-safe";

const { CALL_API } = require("redux-api-middleware");

const baseUrl = "http://localhost:5000/api/v1";
// const baseUrl = "https://api.mycommunity.ksocial.io/api/v1";

export default (store) => (next) => (action) => {
    const callApiAction = action && action[CALL_API];
    if (callApiAction) {
        console.log(stringify({
                ...callApiAction,
                endpoint: `${baseUrl}/${callApiAction.endpoint}`,
            }));
        return next({
            [CALL_API]: {
                ...callApiAction,
                endpoint: `${baseUrl}/${callApiAction.endpoint}`,
            },
        });
    }
    return next(action);
};
