import { REHYDRATE } from "redux-persist/constants";
import {
    call,
    fork,
    put,
    select,
    take,
    takeEvery,
    takeLatest,
} from "redux-saga/effects";
import clearFeedbackMessageSaga from "./clearFeedbackMessageSaga";
import handleAuthWithRoutesSaga from "./handleAuthWithRoutesSaga";
import loadCurrentUserDataSaga from "./loadCurrentUserDataSaga";
import loginSaga from "./loginSaga";
import noCommunityScreenSaga from "./noCommunityScreenSaga";

export default function* rootSaga(dispatch) {
    yield take(REHYDRATE);
    yield fork(handleAuthWithRoutesSaga, dispatch);
    yield fork(loginSaga);
    yield fork(noCommunityScreenSaga);
    yield fork(loadCurrentUserDataSaga);
    yield fork(clearFeedbackMessageSaga);
}
