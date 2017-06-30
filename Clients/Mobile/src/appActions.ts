import { CALL_API_FSA } from "./actions";
import * as actions from "./actions/index";
import IFeedback from "./IFeedback";
import * as schemas from "./schemas";

// tslint:disable:object-literal-sort-keys
// tslint:disable-next-line:no-var-requires
const { CALL_API } = require("redux-api-middleware");

export default {
    loadCurrentUser: () => {
        const endpoint = `users/me`;
        return getCallApiAction(endpoint, schemas.user, "currentUser");
    },
    loadCommunity: (communityId: number) => {
        const endpoint = `communities/${communityId}`;
        return getCallApiAction(endpoint, schemas.community);
    },
    loadNewestPosts: (communityId: number, limit = null) => {
        const now = new Date().toUTCString();
        const endpoint = `communities/${communityId}/posts/?before=${now}&limit=${limit || ""}`;
        return getCallApiAction(endpoint, schemas.postList);
    },
    loadNewerPosts: (communityId: number, afterDateTime: Date, limit = null) => {
        const now = new Date().toUTCString();
        const queryString = `before=${now}&after=${afterDateTime.toUTCString()}&limit=${limit || ""}`;
        const endpoint = `communities/${communityId}/posts/?${queryString}`;
        return getCallApiAction(endpoint, schemas.postList);
    },
    loadOlderPosts: (communityId: number, beforeDateTime: Date, limit) => {
        const queryString = `before=${beforeDateTime.toUTCString()}&limit=${limit || ""}`;
        const endpoint = `communities/${communityId}/posts/?${queryString}`;
        return getCallApiAction(endpoint, schemas.postList);
    },
    saveFeedback: (userId: number, communityId: number, feedbackData: IFeedback) => {
        const endpoint = `communities/${communityId}/feedbackMessages`;
        const subject = feedbackData.subject && `Subject: ${feedbackData.subject}`;
        const body = {
            user: { id: userId },
            message: `${subject || ""}\n${feedbackData.message}`.trim()
        };
        return getCallApiActionPost(endpoint, null, body, "sendFeedback");
    },
    refreshToken: () => {
        return { type: actions.REFRESH_TOKEN };
    },
};

export function getCallApiFSA(action) {
    return action;
}

function getCallApiAction(endpoint: string, responseSchema, source = null) {
    return getCallApiAction2(endpoint, responseSchema, source, "GET");
}

function getCallApiActionPost(endpoint: string, responseSchema, body: any, source = null) {
    return getCallApiAction2(endpoint, responseSchema, source, "POST", {
        body: JSON.stringify(body),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    });
}

function getCallApiActionPutFile(
    endpoint: string, responseSchema, file: File, source = null,
    onSuccess: (response: any) => any = null,
    onFailure: (response: any) => any = null) {
    const body = new FormData();
    body.append(file.name, file);

    return getCallApiAction2(endpoint, responseSchema, source, "POST", {
        body,
        headers: {
        },
    }, onSuccess, onFailure);
}

function getCallApiActionPut(endpoint: string, responseSchema, body: any, source = null) {
    return getCallApiAction2(endpoint, responseSchema, source, "PUT", {
        body: JSON.stringify(body),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    });
}

function getCallApiAction2(
    endpoint: string, responseSchema, source, method, extra = null,
    onSuccess: (response: any) => any = null,
    onFailure: (response: any) => any = null) {
    return ({
        type: actions.CALL_API_FSA,
        payload: {
            endpoint,
            method,
            ...extra,
            types: [
                {
                    meta: (action, state) => {
                        // console.log(`REQUEST: ${endpoint}`);
                        return {
                            schema: responseSchema,
                            ...(source && { source }),
                        };
                    },
                    type: "REQUEST",
                },
                {
                    meta: (action, state, res) => {
                        console.log(`SUCCESS RESPONSE (${endpoint}): ${JSON.stringify(res.body)}`);
                        if (onSuccess) {
                            onSuccess(res);
                        }
                        return {
                            schema: responseSchema,
                            ...(source && { source }),
                        };
                    },
                    type: "SUCCESS",
                },
                {
                    meta: (action, state, res) => {
                        if (onFailure) {
                            onFailure(res);
                        }
                        if (res) {
                            return {
                                schema: responseSchema,
                                ...(source && { source }),
                                status: res.status,
                                statusText: res.statusText,
                            };
                        } else {
                            return {
                                schema: responseSchema,
                                ...(source && { source }),
                                status: "Network request failed",
                            };
                        }
                    },
                    type: "FAILURE",
                },
            ],
        }
    });
}
