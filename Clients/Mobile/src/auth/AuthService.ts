import { Store } from "redux";
// tslint:disable-next-line:no-var-requires
const Auth0Lock = require("react-native-lock");
import { AsyncStorage } from "react-native";

export class AuthService {
    private lock: any;
    private store: Store<any>;
    constructor() {
        // Configure Auth0
        this.lock = new Auth0Lock({
            authParams: { scope: "openid name email nickname" },
            clientId: "b9qXtslkn3dQpk4ZVhqNTBBaN8o3VUtn",
            domain: "mycommunity.auth0.com",
            useBrowser: false,
        });
        this._doAuthentication = this._doAuthentication.bind(this);
        this.login = this.login.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.setStore = this.setStore.bind(this);
    }

    public setStore(store: Store<any>) {
        this.store = store;
    }

    public login(callback?: any) {
        // Call the show method to display the widget.
        this.lock.show({}, (err, profile, token) => {
            if (!err) {
                this._doAuthentication(token);
                this.store.dispatch({ type: "SET_AUTH_PROFILE", payload: profile });
            }
            if (callback) {
                this.store.dispatch({ type: "AUTH_LOGIN_FAILED", payload: err });
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
        this.store.dispatch({ type: "SET_AUTH_TOKEN", payload: token });
    }

    public getToken() {
        // Retrieves the user token from local storage
        // return AsyncStorage.getItem("id_token");
        return this.store.getState().app.idToken;
    }

    public getRefreshToken() {
        return this.store.getState().app.refreshToken;
    }

    public logout() {
        // Clear user token and profile data from local storage
        // AsyncStorage.removeItem("id_token");
        this.store.dispatch({ type: "REMOVE_AUTH_TOKEN", payload: true });
    }

    public refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return Promise.reject("no refresh token");
        }
        return this.lock.authenticationAPI().refreshToken(refreshToken, {});
    }

    private _doAuthentication(token) {
        // Saves the user token
        this.setToken(token);
        // navigate to the home route
        // browserHistory.replace("/home");
    }
}

export default new AuthService();
