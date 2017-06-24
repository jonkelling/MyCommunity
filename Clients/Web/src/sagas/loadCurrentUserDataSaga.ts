import Enumerable from "linq";
import { takeEvery } from "redux-saga/effects";
import { call, put, select } from "redux-saga/effects";
import { GET_CURRENT_USER_SUCCESS } from "../actions";
import appActions from "../appActions";
import AuthService from "../auth/AuthService";
import { locationRequiresAuthPattern } from "../sagaPatterns";
import waitCurrentUserSaga from "./waitCurrentUserSaga";

export default function* loadCurrentUserDataSaga() {
    const state = yield select();

    if (AuthService.isAuthenticated()) {
        yield put(appActions.loadCurrentUser());
    }

    yield takeEvery(locationRequiresAuthPattern(), function* () {
        if (!(yield select()).app.currentUser) {
            yield put(appActions.loadCurrentUser());
        }
    });

    yield takeEvery(GET_CURRENT_USER_SUCCESS, alwaysLoadCurrentUserDataSaga);
}

function* alwaysLoadCurrentUserDataSaga() {
    const state = yield select();

    const currentUser = state.app.currentUser;
    if (!currentUser || !currentUser.communityId) {
        // if ((yield select()).app.screenId !== ScreenId.NoCommunityAssigned) {
        //     yield put(appNavigation.startNoCommunityAssigned());
        // }
        return;
    }

    yield put(appActions.loadCommunity(currentUser.communityId));
    yield put(appActions.loadNewestPosts(currentUser.communityId, 20));
}
