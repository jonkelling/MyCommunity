import Enumerable from "linq";
import { InteractionManager } from "react-native";
import { takeEvery } from "redux-saga/effects";
import { call, put, select } from "redux-saga/effects";
import { GET_CURRENT_USER_SUCCESS } from "../actions";
import appActions, { getCallApiFSA } from "../appActions";
import waitCurrentUserSaga from "./waitCurrentUserSaga";

export default function* loadCurrentUserDataSaga() {
    const state = yield select();

    if (state.app.idToken) {
        yield put(getCallApiFSA(appActions.loadCurrentUser()));
    }

    yield takeEvery(GET_CURRENT_USER_SUCCESS, alwaysLoadCurrentUserDataSaga);
}

function* alwaysLoadCurrentUserDataSaga() {
    const state = yield select();

    const email = state.app.profile && state.app.profile.email;
    const currentUser = state.entities.users && Enumerable
        .from(state.entities.users)
        .select((x) => x.value)
        .singleOrDefault((x) => x.email === email);

    if (!currentUser) {
        return;
    }

    if (!currentUser.communityId) {
        return;
    }

    yield put(getCallApiFSA(appActions.loadCommunity(currentUser.communityId)));
    yield put(getCallApiFSA(appActions.loadNewestPosts(currentUser.communityId, 20)));
}
