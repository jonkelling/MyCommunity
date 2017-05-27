import { InteractionManager } from "react-native";
import { call, put, select } from "redux-saga/effects";
import appActions, { getCallApiFSA } from "../appActions";
import waitCurrentUserSaga from "./waitCurrentUserSaga";

export default function* loadCurrentUserDataSaga() {
    while (true) {
        const currentUser = yield call(waitCurrentUserSaga);

        if (!currentUser) {
            continue;
        }

        if (!currentUser.communityId) {
            continue;
        }

        yield put(getCallApiFSA(appActions.loadCommunity(currentUser.communityId)));
        yield put(getCallApiFSA(appActions.loadNewestPosts(currentUser.communityId, 20)));
    }
}
