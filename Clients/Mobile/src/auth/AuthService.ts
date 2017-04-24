import { Store } from "redux";
// tslint:disable-next-line:no-var-requires
const Auth0Lock = require("react-native-lock");
import { AsyncStorage } from "react-native";

export default class AuthService {
    private lock: any;
    private store: Store<any>;
    constructor(store: Store<any>) {
        // Configure Auth0
        this.lock = new Auth0Lock({
            clientId: "b9qXtslkn3dQpk4ZVhqNTBBaN8o3VUtn",
            domain: "mycommunity.auth0.com",
        });
        this.store = store;
        this._doAuthentication = this._doAuthentication.bind(this);
        this.login = this.login.bind(this);
    }

    public login(callback: any) {
        // Call the show method to display the widget.
        this.lock.show({}, (err, profile, token) => {
            if (!err) {
                this._doAuthentication(token);
            }
            callback(err, profile, token);
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
        const state = this.store.getState();
        return "nothingyet";
    }

    public logout() {
        // Clear user token and profile data from local storage
        // AsyncStorage.removeItem("id_token");
        this.store.dispatch({ type: "REMOVE_AUTH_TOKEN", payload: true });
    }

    private _doAuthentication(token) {
        // Saves the user token
        this.setToken(token);
        // navigate to the home route
        // browserHistory.replace("/home");
    }
}
