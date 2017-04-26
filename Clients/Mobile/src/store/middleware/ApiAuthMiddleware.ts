// tslint:disable:no-var-requires
const { CALL_API } = require("redux-api-middleware");

export default (store) => (next) => (action) => {
    if (action && action === CALL_API) {
        return next(action);
    }
    if (action && action[CALL_API]) {
        const callApiAction = {
            ...action[CALL_API],
            headers: {
                ...action[CALL_API].headers,
                authorization: `Bearer ${store.getState().app.idToken}`,
            },
        };
        return next({ [CALL_API]: callApiAction });
    }
    return next(action);
};
