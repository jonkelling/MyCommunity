// tslint:disable-next-line:no-var-requires
import auth0 from "auth0-js";
import { Store } from "redux";
import * as actions from "../actions/index";

export class AuthService {
    private lock: any;
    private store: Store<any>;
    constructor() {
        // Configure Auth0
        this.lock = new auth0.WebAuth({
            domain: "mycommunity.auth0.com",
            clientID: "b9qXtslkn3dQpk4ZVhqNTBBaN8o3VUtn",
            redirectUri: "http://localhost:3000",
            audience: "https://mycommunity.auth0.com/userinfo",
            responseType: "token id_token",
            scope: "openid"
        });
        this.doAuthentication = this.doAuthentication.bind(this);
        this.login = this.login.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.setStore = this.setStore.bind(this);
    }

    public setStore(store: Store<any>) {
        this.store = store;
    }

    public login(callback?: any) {
        // Call the show method to display the widget.
        this.store.dispatch({ type: actions.LOGGING_IN });
        this.lock.show({}, (err, profile, token) => {
            if (!err) {
                this.doAuthentication(token);
                this.store.dispatch({ type: actions.SET_AUTH_PROFILE, payload: profile });
                return;
            }
            this.store.dispatch({ type: actions.AUTH_LOGIN_FAILED, payload: err });
            if (callback) {
                callback(err, profile, token);
            }
        });
    }

    public loggedIn() {
        // Checks if there is a saved token and it's still valid
        return !!this.getToken();
    }

    public setToken(token) {
        // Saves user token to local storage
        // AsyncStorage.setItem("id_token", idToken);
        this.store.dispatch({ type: actions.SET_AUTH_TOKEN, payload: { idToken: token.idToken } });
    }

    public getToken() {
        // Retrieves the user token from local storage
        // return AsyncStorage.getItem("id_token");
        return this.store.getState().app.idToken;
    }

    public getRefreshToken() {
        return null;
    }

    public logout() {
        // Clear user token and profile data from local storage
        // AsyncStorage.removeItem("id_token");
        this.store.dispatch({ type: actions.REMOVE_AUTH_TOKEN, payload: true });
    }

    public refreshToken() {
        return this
            .getRefreshToken()
            .then((credentials) => {
                if (!credentials) {
                    throw new Error("no refresh token");
                }
                return credentials.password;
            })
            .then((refreshToken) => {
                return this.lock.authenticationAPI().refreshToken(refreshToken, {});
            });
    }

    private doAuthentication(token) {
        // Saves the user token
        this.setToken(token);
        // navigate to the home route
        // browserHistory.replace("/home");
    }
}

export default new AuthService();
