import { CALL_API_FSA } from "./actions";
import * as actions from "./actions/index";
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
    createPost: (communityId: number, title: string, content: string) => {
        const endpoint = `communities/${communityId}/posts`;
        return getCallApiActionPost(endpoint, schemas.postList, {
            headline: title,
            content,
            author: { id: 1 }
        });
    },
};

export function getCallApiFSA(action) {
    return { type: CALL_API_FSA, payload: action };
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

function getCallApiAction2(endpoint: string, responseSchema, source, method, extra = null) {
    return ({
        [CALL_API]: {
            endpoint,
            method: "POST",
            ...extra,
            types: [
                {
                    meta: (action, state) => {
                        console.log(`REQUEST: ${endpoint}`);
                        return {
                            schema: responseSchema,
                            ...(source && { source }),
                        };
                    },
                    type: "REQUEST",
                },
                {
                    meta: (action, state, res) => {
                        console.log(`SUCCESS RESPONSE (${endpoint}): ${JSON.stringify(res)}`);
                        return {
                            schema: responseSchema,
                            ...(source && { source }),
                        };
                    },
                    type: "SUCCESS",
                },
                {
                    meta: (action, state, res) => {
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
        },
    });
}
