// tslint:disable-next-line:no-var-requires
import auth0 from "auth0-js";
import { Store } from "redux";
import * as actions from "../actions/index";

export class AuthService {
    private auth0: any;
    private store: Store<any>;
    constructor(redirectUri: string) {
        // Configure Auth0
        this.auth0 = new auth0.WebAuth({
            domain: "mycommunity.auth0.com",
            clientID: "b9qXtslkn3dQpk4ZVhqNTBBaN8o3VUtn",
            redirectUri,
            audience: "https://mycommunity.auth0.com/userinfo",
            responseType: "token id_token",
            scope: "openid name email nickname"
        });
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.setSession = this.setSession.bind(this);
        this.setStore = this.setStore.bind(this);
    }

    public setStore(store: Store<any>) {
        this.store = store;
    }

    public login(callback?: any) {
        // Call the show method to display the widget.
        this.store.dispatch({ type: actions.LOGGING_IN });
        this.auth0.authorize();
    }

    public handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                // history.replace("/home");
            } else if (err) {
                // history.replace("/home");
                console.log(err);
            }
        });
    }

    public setSession(authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            // Set the time that the access token will expire at
            const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            localStorage.setItem("access_token", authResult.accessToken);
            localStorage.setItem("id_token", authResult.idToken);
            localStorage.setItem("expires_at", expiresAt);
            // navigate to the home route
            // history.replace("/home");
            this.store.dispatch({ type: actions.SET_AUTH_TOKEN, authResult });
        }
    }

    public logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        // navigate to the home route
        // history.replace("/home");
    }

    public isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return new Date().getTime() < expiresAt;
    }
}

export default new AuthService("http://localhost:3000");
