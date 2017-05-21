import * as actions from "../../actions/index";
import AuthService, { AuthService as AuthServiceType } from "../../auth/AuthService";

let authService: AuthServiceType;

export default (store) => {
    authService = AuthService;
    authService.setStore(store);

    return (next) => (action) => {
        if (action.type === actions.AUTH0_LOGIN) {
            authService.login();
        }

        if (action.type === actions.AUTH0_LOGOUT) {
            authService.logout();
        }

        return next(action);
    };
};
