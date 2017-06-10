const { CALL_API } = require("redux-api-middleware");
import { call, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import * as actions from "../actions/index";
const stringify = require("json-stringify-safe");
import Enumerable from "../../node_modules/linq/linq";

const GET_CURRENT_USER_SUCCESS = "GET_CURRENT_USER_SUCCESS";
const GET_CURRENT_USER_FAILURE = "GET_CURRENT_USER_FAILURE";

export default function* loginSaga() {
    yield takeEvery(actions.SUCCESS, apiSuccess);
    yield takeEvery(actions.FAILURE, apiFailure);

    while (true) {
        yield take(actions.SET_AUTH_PROFILE);
        console.log("====================================");
        console.log("* start loginSaga.");
        console.log("====================================");

        {
            const state = yield select();
            console.log(`* getCurrentUser ${stringify(state)}`);
            // yield put(getCallApiFSA(appActions.loadCurrentUser()));
        }

        // {
        //     yield take(GET_CURRENT_USER_SUCCESS);
        //     const state = yield select();
        //     console.log(`* getCurrentUserSuccess ${stringify(state)}`);

        //     const email = state.app.profile && state.app.profile.email;
        //     const currentUser = state.entities.users && Enumerable
        //         .from(state.entities.users)
        //         .select((x) => x.value)
        //         .singleOrDefault((x) => x.email === email);

        //     if (!currentUser || !currentUser.communityId) {
        //         yield put(appNavigation.startNoCommunityAssigned());
        //     }
        // }
    }
}

function* apiSuccess(action) {
    const source = (action && action.meta && action.meta.source);
    if (source === "currentUser") {
        yield put({ type: GET_CURRENT_USER_SUCCESS, payload: action.payload });
    }
}

function* apiFailure(action) {
    const source = (action && action.meta && action.meta.source);
    if (source === "currentUser") {
        yield put({ type: GET_CURRENT_USER_FAILURE, payload: action.payload });
    }
}
