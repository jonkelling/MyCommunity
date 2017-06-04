const stringify = require("json-stringify-safe");

export default (store) => (next) => (action) => {
    try {
        console.log(stringify(action));
        // console.warn(`ACTION: ${JSON.stringify(action)}`);
    }
    catch (e) {
        console.log(e);
        // console.warn(`ACTION: ${action}`);
    }
    return next(action);
};
