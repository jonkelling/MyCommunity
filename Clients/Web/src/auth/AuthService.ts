import auth0 from "auth0-js";
import { Store } from "redux";
import { go, goBack, goForward, push, replace } from "redux-little-router";
import * as actions from "../actions/index";
export class AuthService {
    private auth0: any;
    private store: Store<any>;
    private redirectUri: string;
    constructor() {
        this.configure = this.configure.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.setSession = this.setSession.bind(this);
        this.setStore = this.setStore.bind(this);
        this.renew = this.renew.bind(this);
    }
    public configure(redirectUri: string) {
        this.redirectUri = redirectUri;
        this.auth0 = new auth0.WebAuth({
            domain: "mycommunity.auth0.com",
            clientID: "b9qXtslkn3dQpk4ZVhqNTBBaN8o3VUtn",
            redirectUri,
            audience: "https://mycommunity.auth0.com/userinfo",
            responseType: "token id_token",
            scope: "openid name email nickname",
            leeway: 30
        });
    }
    public setStore(store: Store<any>) {
        this.store = store;
    }
    public login(callback?: any) {
        this.store.dispatch({ type: actions.LOGGING_IN });
        this.auth0.authorize();
    }
    public handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                console.log(err);
                this.renew()
                    .then((authResult2) => {
                        this.setSession(authResult2);
                    })
                    .catch(() => {
                        console.log("err");
                        setTimeout(() => this.login(), 2000);
                    });
            }
        });
    }
    private setSession(authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            const idTokenPayload = authResult.idTokenPayload;
            const expiresAt = JSON.stringify(idTokenPayload.exp * 1000);
            const issuedAt = JSON.stringify(idTokenPayload.iat * 1000);
            localStorage.setItem("access_token", authResult.accessToken);
            localStorage.setItem("id_token", authResult.idToken);
            localStorage.setItem("expires_at", expiresAt);
            localStorage.setItem("issued_at", issuedAt);
            this.store.dispatch({ type: actions.SET_AUTH_TOKEN, authResult });
        }
    }
    public logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("issued_at");
    }
    public isAuthenticated() {
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return new Date().getTime() < expiresAt;
    }
    public isHalfWayToExpiration() {
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        const issuedAt = JSON.parse(localStorage.getItem("issued_at"));
        const halfTime = (expiresAt - issuedAt) / 2;
        return (
            (new Date().getTime() > (expiresAt - halfTime)) &&
            (new Date().getTime() < expiresAt)
        );
    }
    public renew() {
        return new Promise((resolve, reject) => {
            this.auth0.renewAuth({
                audience: "https://mycommunity.auth0.com/userinfo",
                scope: "openid name email nickname",
                redirectUri: `${this.redirectUri}/auth-silent-callback.html`,
                responseType: "token id_token",
                usePostMessage: false
            }, (err, authResult) => {
                if (err) {
                    return reject(err);
                }
                console.log(authResult);
                this.setSession(authResult);
                return resolve();
            });
        });
    }
}

export default new AuthService();
