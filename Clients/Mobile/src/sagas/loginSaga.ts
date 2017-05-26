const { CALL_API } = require("redux-api-middleware");
import { call, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import * as actions from "../actions/index";
import appActions from "../appActions";
import appNavigation from "../appNavigation";
const stringify = require("json-stringify-safe");
import { InteractionManager } from "react-native";
import Enumerable from "../../node_modules/linq/linq";

const GET_CURRENT_USER_SUCCESS = "GET_CURRENT_USER_SUCCESS";
const GET_CURRENT_USER_FAILURE = "GET_CURRENT_USER_FAILURE";

export default function* loginSaga(dispatch) {
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
            dispatch(appActions.loadCurrentUser());
        }

        {
            yield take(GET_CURRENT_USER_SUCCESS);
            const state = yield select();
            console.log(`* getCurrentUserSuccess ${stringify(state)}`);

            const email = state.app.profile && state.app.profile.email;
            const currentUser = state.entities.users && Enumerable
                .from(state.entities.users)
                .select((x) => x.value)
                .singleOrDefault((x) => x.email === email);

            if (!currentUser || !currentUser.communityId) {
                dispatch(appNavigation.startNoCommunityAssigned());
            }
            else {
                InteractionManager.runAfterInteractions(() => {
                    dispatch(appActions.loadCommunity(currentUser.communityId));
                    dispatch(appActions.loadNewestPosts(currentUser.communityId));
                });
            }
        }
    }
}

function* apiSuccess(action) {
    const source = (action && action.meta && action.meta.source);
    if (source === "currentUser") {
        yield put({ type: GET_CURRENT_USER_SUCCESS });
    }
}

function* apiFailure(action) {
    const source = (action && action.meta && action.meta.source);
    if (source === "currentUser") {
        yield put({ type: GET_CURRENT_USER_FAILURE });
    }
}
