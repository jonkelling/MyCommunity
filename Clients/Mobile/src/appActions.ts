import * as schemas from "./schemas";

// tslint:disable:object-literal-sort-keys
// tslint:disable-next-line:no-var-requires
const { CALL_API } = require("redux-api-middleware");

const baseUrl = "http://localhost:5000/api/v1";

export default {
    loadCurrentUser: () => {
        const endpoint = `${baseUrl}/users/me`;
        return getCallApiAction(endpoint, schemas.user);
    },
    loadCommunity: (communityId: number) => {
        const endpoint = `${baseUrl}/communities/${communityId}`;
        return getCallApiAction(endpoint, schemas.community);
    },
    loadNewestPosts: (communityId: number, limit = null) => {
        const now = new Date().toUTCString();
        const endpoint = `${baseUrl}/communities/${communityId}/posts/?before=${now}&limit=${limit || ""}`;
        return getCallApiAction(endpoint, schemas.postList);
    },
    loadNewerPosts: (communityId: number, afterDateTime: Date, limit = null) => {
        const now = new Date().toUTCString();
        const queryString = `before=${now}&after=${afterDateTime.toUTCString()}&limit=${limit || ""}`;
        const endpoint = `${baseUrl}/communities/${communityId}/posts/?${queryString}`;
        return getCallApiAction(endpoint, schemas.postList);
    },
    loadOlderPosts: (communityId: number, beforeDateTime: Date, limit) => {
        const queryString = `before=${beforeDateTime.toUTCString()}&limit=${limit || ""}`;
        const endpoint = `${baseUrl}/communities/${communityId}/posts/?${queryString}`;
        return getCallApiAction(endpoint, schemas.postList);
    },
};

function getCallApiAction(endpoint: string, responseSchema, source = null) {
    return ({
        [CALL_API]: {
            endpoint,
            method: "GET",
            types: [
                {
                    meta: {
                        schema: responseSchema,
                        ...(source && { source }),
                    },
                    type: "REQUEST",
                },
                {
                    meta: {
                        schema: responseSchema,
                        ...(source && { source }),
                    },
                    type: "SUCCESS",
                },
                {
                    meta: (action, state, res) => {
                        if (res) {
                            return {
                                meta: {
                                    schema: responseSchema,
                                    ...(source && { source }),
                                },
                                status: res.status,
                                statusText: res.statusText,
                            };
                        } else {
                            return {
                                meta: {
                                    schema: responseSchema,
                                    ...(source && { source }),
                                },
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
