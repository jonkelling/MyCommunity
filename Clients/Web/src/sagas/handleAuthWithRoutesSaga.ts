import stringify from "json-stringify-safe";
import { CALL_API } from "redux-api-middleware";
import { push, replace } from "redux-little-router";
import * as router from "redux-little-router";
import { delay } from "redux-saga";
import {
    actionChannel, call, fork, put,
    race, select, take, takeEvery
} from "redux-saga/effects";
import Enumerable from "../../node_modules/linq/linq";
import * as actions from "../actions/index";
import appActions from "../appActions";
import AuthService from "../auth/AuthService";
import {
    authShouldRenewPattern,
    callApiPattern,
    locationChangedPattern,
    locationChangedToPathNamePattern,
    locationRequiresAuthPattern
} from "../sagaPatterns";

export default function* handleAuthWithRoutesSaga(dispatch) {
    yield takeEvery(
        locationChangedToPathNamePattern("/login"),
        function* (action) {
            AuthService.login();
        }
    );
    yield takeEvery(
        locationChangedToPathNamePattern("/logout"),
        function* (action) {
            yield put({ type: actions.LOGOUT });
        }
    );
    yield takeEvery(actions.LOGOUT, function* () {
        AuthService.logout();
        yield put(router.replace("/"));
    });
    // yield takeEvery(
    //     locationChangedPattern((action) =>
    //         action.payload.result &&
    //         action.payload.result.auth &&
    //         !AuthService.isAuthenticated()
    //     ),
    //     function* (action) {
    //         yield put(replace("/login"));
    //     }
    // );
    yield fork(handleRenewals, dispatch);
    yield takeEvery(
        actions.SET_AUTH_TOKEN,
        function* () {
            if (!(yield select()).app.refreshingToken) {
                yield call(delay, 1); // give time for auth token to get set
                yield put(appActions.loadCurrentUser());
                yield put(replace("/dashboard"));
            }
        }
    );
    yield takeEvery(
        locationChangedPattern((action) =>
            /access_token|id_token|error/.test(window.location.hash)
        ),
        function* (action) {
            console.log("Calling AuthService.handleAuthentication.");
            AuthService.handleAuthentication();
        }
    );
}

function* handleRenewals(dispatch) {
    yield takeEvery(
        locationChangedPattern(locationRequiresAuthPattern()),
        function* (action) {
            if (authShouldRenewPattern()(action)) {
                yield call(renewAuthToken, dispatch, false);
            } else if (!AuthService.isAuthenticated()) {
                yield put(replace("/login"));
            }
        }
    );
    const callApiChannel = yield actionChannel(actions.CALL_API_FSA);
    while (true) {
        const callApiAction = yield take(callApiChannel);

        if (authShouldRenewPattern()(callApiAction)) {
            const { success, failure } = yield call(renewAuthToken, dispatch, false, callApiAction);
            if (success) {
                dispatch({ [CALL_API]: callApiAction.payload });
            }
        }
        else {
            dispatch({ [CALL_API]: callApiAction.payload });
        }
    }
}

function* renewAuthToken(dispatch) {
    const state = yield select();
    if (state.app.refreshingToken) {
        yield put({ type: `WAIT_FOR_${actions.REFRESHING_TOKEN}` });
    }
    else {
        yield put({
            type: actions.REFRESHING_TOKEN,
            payload: { reason: "halfway to token expiration." }
        });
        AuthService.renew()
            .then(() => {
                console.log("Successfully renewed token.");
                dispatch({ type: actions.REFRESHING_TOKEN_SUCCESS });
            })
            .catch((err) => {
                console.log(`Failed to renew token: ${stringify(err)}`);
                dispatch({ type: actions.REFRESHING_TOKEN_FAILURE });
                dispatch(push("/logout"));
                dispatch(push("/login"));
            });
    }
    return yield race({
        success: take(actions.REFRESHING_TOKEN_SUCCESS),
        failure: take(actions.REFRESHING_TOKEN_FAILURE),
    });
}
