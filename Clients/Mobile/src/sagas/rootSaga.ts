import {
    call,
    fork,
    put,
    select,
    take,
    takeEvery,
    takeLatest,
} from "redux-saga/effects";
import loadCurrentUserDataSaga from "./loadCurrentUserDataSaga";
import loginSaga from "./loginSaga";
import noCommunityScreenSaga from "./noCommunityScreenSaga";

export default function* rootSaga(dispatch) {
    yield fork(loginSaga, dispatch);
    yield fork(noCommunityScreenSaga);
    yield fork(loadCurrentUserDataSaga);
}
