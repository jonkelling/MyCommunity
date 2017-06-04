import * as actions from "../../actions/index";
import AuthService from "../../auth/AuthService";
import * as jwtHelper from "../../auth/jwtHelper";
// tslint:disable:no-var-requires
const { CALL_API } = require("redux-api-middleware");

export default (store) => (next) => (action) => {
    if (action && action === CALL_API) {
        return next(action);
    }
    if (action && (action[CALL_API] || action.type === actions.REFRESH_TOKEN)) {
        const idToken = AuthService.getToken();

        if (!idToken || jwtHelper.isTokenExpired(idToken)) {
            if (!store.getState().app.loggingIn &&
                !store.getState().app.refreshingToken) {
                AuthService.refreshToken()
                    .then((token) => {
                        AuthService.setToken(token);
                        if (token.idToken) {
                            store.dispatch({ type: actions.REFRESHING_TOKEN_SUCCESS });
                            if (action.type !== actions.REFRESH_TOKEN) {
                                store.dispatch(action);
                            }
                        }
                        else {
                            throw new Error("Invalid token returned from refresh token service.");
                        }
                    })
                    .catch((error) => {
                        console.info(`refresh token error ${error}.`);
                        store.dispatch({ type: actions.REFRESHING_TOKEN_FAILURE });
                    });
                store.dispatch({ type: actions.REFRESHING_TOKEN });
            }
            else {
                // delay and retry CALL_API action
                if (action.type !== actions.REFRESH_TOKEN) {
                    setTimeout(() => store.dispatch(action), 500);
                    return;
                }
            }
        }
    }
    return next(action);
};
