// tslint:disable-next-line:no-reference
/// <reference path="../../node_modules/react-native-keychain/typings/react-native-keychain.d.ts" />

import * as Keychain from "react-native-keychain";
import { Store } from "redux";
import * as actions from "../actions/index";
// tslint:disable-next-line:no-var-requires
const Auth0Lock = require("react-native-lock");
import { AsyncStorage } from "react-native";
import { getTokenIssuedAtDate, getTokenExpirationDate, isTokenExpired } from "./jwtHelper";

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
        this.store.dispatch({
            type: actions.SET_AUTH_TOKEN, payload: {
                idToken: token.idToken,
                expiresAt: getTokenExpirationDate(token.idToken),
                issuedAt: getTokenIssuedAtDate(token.idToken),
            }
        });
        if (token.refreshToken) {
            Keychain
                .setGenericPassword("refreshToken", token.refreshToken)
                .then(() => {
                    console.log(`Credentials saved successfully!`);
                });
        }
    }

    public getToken() {
        // Retrieves the user token from local storage
        // return AsyncStorage.getItem("id_token");
        return this.store.getState().app.idToken;
    }

    public getRefreshToken() {
        return Keychain
            .getGenericPassword()
            .then((credentials: any) => {
                console.log("Credentials successfully loaded for user " + credentials.username);
                return credentials;
            }).catch((error) => {
                console.log("Kefychain couldn't be accessed! Maybe no value set?", error);
                throw error;
            });
    }

    public logout() {
        // Clear user token and profile data from local storage
        // AsyncStorage.removeItem("id_token");
        this.store.dispatch({ type: actions.REMOVE_AUTH_TOKEN, payload: true });
    }

    public isAuthenticated() {
        const state = this.store.getState();
        const expiresAt = getTokenExpirationDate(state.app.idToken);
        if (!expiresAt) {
            return false;
        }
        // return false;
        return new Date().valueOf() < expiresAt.valueOf();
    }

    public isHalfWayToExpiration() {
        const state = this.store.getState();
        if (!state.app.expiresAt) {
            return false;
        }
        const expiresAt = state.app.expiresAt.valueOf();
        const issuedAt = state.app.issuedAt;
        const halfTime = (expiresAt - issuedAt) / 2;
        return (
            (new Date().valueOf() > (expiresAt - halfTime)) &&
            (new Date().valueOf() < expiresAt)
        );
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
            })
            .then((token) => {
                this.setToken(token);
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
