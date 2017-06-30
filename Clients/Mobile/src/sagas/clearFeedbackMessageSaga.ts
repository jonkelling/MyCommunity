import { Alert } from "react-native";
import { delay } from "redux-saga";
import { call, put, race, take } from "redux-saga/effects";
import * as actions from "../actions";
import editsActions from "../editsActions";
import * as sagaPatterns from "../sagaPatterns";

const sendFeedbackSourceKey = "sendFeedback";
const sendFeedbackAction = (type) => sagaPatterns.metaSourcePattern(sendFeedbackSourceKey, type);

export default function* clearFeedbackMessageSaga() {
    while (true) {
        yield take(sendFeedbackAction(actions.REQUEST));

        const result = yield race({
            success: take(sendFeedbackAction(actions.SUCCESS)),
            failure: take(sendFeedbackAction(actions.FAILURE)),
        });

        if (result.success) {
            yield put(editsActions.clearEdits(sendFeedbackSourceKey));
            Alert.alert("Thanks for your feedback!");
        }

        if (result.failure) {
            Alert.alert("Could not send feedback. Your message will be saved. Please try again later.");
        }
    }
}
