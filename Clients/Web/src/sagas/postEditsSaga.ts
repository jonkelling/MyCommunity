import { delay } from "redux-saga";
import {
    call,
    fork,
    put,
    select,
    take,
    takeEvery,
    takeLatest,
} from "redux-saga/effects";
import * as actions from "../actions/index";
import appActions from "../appActions";
import editsActions from "../editsActions";
import {
    locationChangedToPathNamePattern,
    metaSchemaOrSourcePattern,
} from "../sagaPatterns";

export default function* postEditsSaga() {
    while (true) {
        const action = yield take(locationChangedToPathNamePattern(/\/post\/(\d+)$/));

        const postId = /\/post\/(\d+)$/.exec(action.payload.pathname)[1];

        yield call(waitForPost, postId);

        yield put(editsActions.updateEdits(
            "post",
            (yield select()).entities.posts[postId])
        );
    }
}

function* waitForPost(postId) {
    if (yield getPost(postId)) {
        return;
    }

    // in case some other process is about to start loading
    yield call(delay, 1);

    {
        const state = yield select();
        const loading = state.app.loading;
        const loadingPosts = loading.posts || loading.post;
        const checking = true;
        const loadingKeys = ["post", "posts"];

        if (loadingPosts) {
            yield call(waitForLoadingToFinish, loadingKeys);
            if (yield getPost(postId)) {
                return;
            }
        }

        yield put({ type: actions.LOG, payload: "loading post" });
        yield put(appActions.loadPost(1, postId));
        yield call(waitForLoadingToFinish, loadingKeys);
    }
}

function* waitForLoadingToFinish(loadingKeys: string | string[]) {
    yield put({ type: actions.LOG, payload: `wait for ${JSON.stringify(loadingKeys)}.` });

    const action = yield take(metaSchemaOrSourcePattern(
        loadingKeys, actions.SUCCESS, actions.FAILURE));

    yield put({
        type: actions.LOG, payload: {
            message: `${JSON.stringify(loadingKeys)} completed.`,
            action
        }
    });
}

function* getPost(postId) {
    const state = yield select();
    const posts = state.entities.posts;
    const post = posts && posts[postId];
    return post;
}
