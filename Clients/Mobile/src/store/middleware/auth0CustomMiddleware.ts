import AuthService from "../../auth/AuthService";

let authService: AuthService;

export default (store) => {
    authService = authService || new AuthService(store);

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
