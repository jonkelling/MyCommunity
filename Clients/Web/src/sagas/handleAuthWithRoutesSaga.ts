import { getCallApiFSA } from "../appActions";
import appActions from "../appActions";
const { CALL_API } = require("redux-api-middleware");
import { call, put, race, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import * as actions from "../actions/index";
const stringify = require("json-stringify-safe");
import { replace } from "redux-little-router";
import * as router from "redux-little-router";
import Enumerable from "../../node_modules/linq/linq";
import AuthService from "../auth/AuthService";

export default function* handleAuthWithRoutesSaga() {
    while (true) {
        const raceResult = yield race({
            loginPath: take((action) =>
                action.type === actions.ROUTER_LOCATION_CHANGED &&
                action.payload && action.payload.pathname === "/login"
            ),
            logoutPath: take((action) =>
                action.type === actions.ROUTER_LOCATION_CHANGED &&
                action.payload && action.payload.pathname === "/logout"
            ),
            authResponse: take((action) =>
                action.type === actions.ROUTER_LOCATION_CHANGED &&
                /access_token|id_token|error/.test(window.location.hash)
            ),
            setAuthToken: take(actions.SET_AUTH_TOKEN),
        });

        if (raceResult.loginPath) {
            AuthService.login();
        }
        else if (raceResult.logoutPath) {
            AuthService.logout();
            yield put(router.replace("/"));
        }
        else if (raceResult.authResponse) {
            console.log(stringify(raceResult.authResponse));
            console.log("Calling AuthService.handleAuthentication.");
            AuthService.handleAuthentication();
        }
        else if (raceResult.setAuthToken) {
            yield put(getCallApiFSA(appActions.loadCurrentUser()));
        }

        // function handleAuthentication(nextState) {
        //     if (/access_token|id_token|error/.test(nextState.location.hash)) {
        //         AuthService.handleAuthentication();
        //     }
        // }

        continue;
    }
}
