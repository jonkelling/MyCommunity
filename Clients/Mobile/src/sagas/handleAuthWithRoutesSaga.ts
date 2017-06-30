import stringify from "json-stringify-safe";
import Enumerable from "linq";
import { CALL_API } from "redux-api-middleware";
import { delay } from "redux-saga";
import {
    actionChannel, call, fork, put,
    race, select, take, takeEvery
} from "redux-saga/effects";
import * as actions from "../actions/index";
import appActions from "../appActions";
import AuthService from "../auth/AuthService";
import {
    authShouldRenewPattern,
    callApiPattern
} from "../sagaPatterns";

export default function* handleAuthWithRoutesSaga(dispatch) {
    yield takeEvery(actions.LOGOUT, function* () {
        AuthService.logout();
        // yield put(router.replace("/"));
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
                // yield put(replace("/dashboard"));
            }
        }
    );
}

function* handleRenewals(dispatch) {
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
        AuthService.refreshToken()
            .then(() => {
                console.log("Successfully renewed token.");
                dispatch({ type: actions.REFRESHING_TOKEN_SUCCESS });
            })
            .catch((err) => {
                console.log(`Failed to renew token: ${stringify(err)}`);
                dispatch({ type: actions.REFRESHING_TOKEN_FAILURE });
            });
    }
    return yield race({
        success: take(actions.REFRESHING_TOKEN_SUCCESS),
        failure: take(actions.REFRESHING_TOKEN_FAILURE),
    });
}
