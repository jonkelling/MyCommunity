import AuthService, { AuthService as AuthServiceType } from "../../auth/AuthService";

let authService: AuthServiceType;

export default (store) => {
    authService = AuthService;
    authService.setStore(store);

    return (next) => (action) => {
        if (action.type === "AUTH0_LOGIN") {
            authService.login();
            return;
        }

        if (action.type === "AUTH0_LOGOUT") {
            authService.logout();
            return;
        }

        return next(action);
    };
};
