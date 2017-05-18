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
            AuthService.refreshToken()
                .then((response) => {
                    AuthService.setToken(response);
                    store.dispatch(action);
                    return; // TODO next(...some action about token being refreshing...)
                })
                .catch((error) => {
                    console.error(`refresh token error: ${JSON.stringify(error)}`);
                    AuthService.login();
                });
        }
    }
    return next(action);
};
