import * as actions from "../../actions/index";
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
            if (!store.getState().app.refreshingToken) {
                AuthService.refreshToken()
                    .then((token) => {
                        AuthService.setToken(token);
                        if (token.idToken) {
                            store.dispatch({ type: actions.REFRESHING_TOKEN_SUCCESS });
                            store.dispatch(action);
                        }
                        else {
                            throw new Error("Invalid token returned from refresh token service.");
                        }
                    })
                    .catch((error) => {
                        console.info(`refresh token error ${error}.`);
                        store.dispatch({ type: actions.REFRESHING_TOKEN_FAILURE });
                        AuthService.login();
                    });
            }
            else {
                // delay and retry CALL_API action
                // setTimeout(() => store.dispatch(action), 500);
                return;
            }
            store.dispatch({ type: actions.REFRESHING_TOKEN });
            return;
        }
    }
    return next(action);
};
