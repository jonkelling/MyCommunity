import * as actions from "../../actions/index";
import appActions from "../../appActions";
import AuthService, { AuthService as AuthServiceType } from "../../auth/AuthService";

let authService: AuthServiceType;

export default (store) => {
    authService = AuthService;
    authService.setStore(store);

    return (next) => (action) => {
        let returnValue;

        if (action.type === actions.AUTH0_LOGIN) {
            authService.login();
        }

        else if (action.type === actions.AUTH0_LOGOUT) {
            authService.logout();
        }

        else if (action.type === actions.REMOVE_AUTH_TOKEN) {
            returnValue = next(action);
        }

        if (!returnValue) {
            return next(action);
        }

        return returnValue;
    };
};
