import { push, replace } from "redux-little-router";
import * as actions from "./actions/index";
import AuthService from "./auth/AuthService";
import IPost from "./IPost";
import * as schemas from "./schemas";

export default {
    push,
    replace,
    loadCurrentUser: () => {
        const endpoint = `users/me`;
        return getCallApiAction(endpoint, schemas.user, "currentUser");
    },
    loadCommunity: (communityId: number) => {
        const endpoint = `communities/${communityId}`;
        return getCallApiAction(endpoint, schemas.community);
    },
    loadPost: (communityId: number, postId: number) => {
        const endpoint = `communities/${communityId}/posts/${postId}`;
        return getCallApiAction(endpoint, schemas.post);
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
        return getCallApiActionPost(endpoint, schemas.post, {
            headline: title,
            content,
            author: { id: 1 }
        });
    },
    savePost: (communityId: number, post: IPost) => {
        const endpoint = `communities/${communityId}/posts/${post.id}`;
        return getCallApiActionPut(endpoint, schemas.post, {
            ...post,
            author: { id: post.author },
        });
    },
    uploadFile: (
        communityId: number, file: File, source: string,
        onSuccess: (response) => any, onFailure: (response) => any) => {
        const endpoint = `communities/${communityId}/images/`;
        return getCallApiActionPutFile(endpoint, null, file, source, onSuccess, onFailure);
    },
    logout: () => {
        return push("/logout");
    },
};

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
