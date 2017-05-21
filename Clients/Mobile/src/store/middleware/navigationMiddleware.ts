import * as actions from "../../actions/index";

export default (store) => (next) => (action) => {
    return next(action);
};
