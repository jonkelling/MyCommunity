import AuthService from "../../auth/AuthService";
import * as jwtHelper from "../../auth/jwtHelper";

// tslint:disable:no-var-requires
const { CALL_API } = require("redux-api-middleware");

export default (store) => (next) => (action) => {
    if (action && action === CALL_API) {
        return next(action);
    }
    if (action && action[CALL_API]) {
        const idToken = AuthService.getToken();

        if (!idToken || jwtHelper.isTokenExpired(idToken)) {
            const refreshToken = AuthService.getRefreshToken();
            AuthService.refreshToken().then((response) => {
                AuthService.setToken(response);
                store.dispatch(action);
                return;
            });
        }
    }
    return next(action);
};
