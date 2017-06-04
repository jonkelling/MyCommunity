import { call, put } from "redux-saga/effects";
import { getCallApiFSA } from "../appActions";
import appActions from "../appActions";
import waitCurrentUserSaga from "./waitCurrentUserSaga";

export default function* getCurrentUserSaga() {
    yield put(getCallApiFSA(appActions.loadCurrentUser()));
    return yield call(waitCurrentUserSaga);
}
