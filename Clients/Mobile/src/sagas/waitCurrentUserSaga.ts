import Enumerable from "linq";
import { race, select, take } from "redux-saga/effects";
import * as actions from "../actions";

function getCurrentUserActionPattern(actionType) {
    return (action) =>
        action && action.meta && (
            action.meta.source === "currentUser" &&
            action.type === actionType
        );
}

export default function* waitCurrentUserSaga() {
    const { success, failure } = yield race({
        success: take(getCurrentUserActionPattern(actions.SUCCESS)),
        failure: take(getCurrentUserActionPattern(actions.FAILURE)),
    });

    if (!success) {
        return null;
    }

    const state = yield select();
    const email = state.app && state.app.profile && state.app.profile.email;
    if (!email) {
        return null;
    }
    const currentUser = state.entities.users && Enumerable
        .from(state.entities.users)
        .select((x) => x.value)
        .singleOrDefault((x) => x.email === email);

    return currentUser;
}
