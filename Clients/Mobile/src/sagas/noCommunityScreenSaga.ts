import { delay } from "redux-saga";
import { call, put, race, take } from "redux-saga/effects";
import * as actions from "../actions";
import appNavigation from "../appNavigation";
import { ScreenId } from "../screens";
import getCurrentUserSaga from "./getCurrentUserSaga";

const noCommunityScreenActionPattern = getSetScreenPattern((screenId) => screenId === ScreenId.NoCommunityAssigned);
const otherScreenActionPattern = getSetScreenPattern((screenId) => screenId !== ScreenId.NoCommunityAssigned);

export default function* noCommunityScreenSaga() {
    while (true) {
        yield take(noCommunityScreenActionPattern);

        const { currentUser, screenChange } = yield race({
            currentUser: call(waitForCurrentUserCommunity),
            screenChange: take(otherScreenActionPattern),
        });

        console.log(`CURRENTUSER: ${JSON.stringify(currentUser)}`);

        if (screenChange) {
            return;
        }

        if (!currentUser || !currentUser.communityId) {
            return;
        }

        yield put(appNavigation.backToApp());
    }
}

function* waitForCurrentUserCommunity() {
    while (true) {
        const currentUser = yield call(getCurrentUserSaga);

        if (currentUser && currentUser.communityId) {
            return currentUser;
        }

        yield call(delay, 300000);
    }
}

function getSetScreenPattern(screenIdPredicate) {
    return (action) =>
        action.type === actions.SET_SCREEN &&
        screenIdPredicate(action.payload);
}
