import { call, put } from "redux-saga/effects";
import appActions from "../appActions";
import waitCurrentUserSaga from "./waitCurrentUserSaga";

export default function* getCurrentUserSaga() {
    yield put(appActions.loadCurrentUser());
    return yield call(waitCurrentUserSaga);
}
