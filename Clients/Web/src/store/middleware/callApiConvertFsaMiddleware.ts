import { CALL_API_FSA } from "../../actions";
const { CALL_API } = require("redux-api-middleware");

export default (store) => (next) => (action) => {
    if (!action || action.type !== CALL_API_FSA) {
        return next(action);
    }
    return next(action.payload);
};
