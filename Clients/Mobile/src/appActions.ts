import * as schemas from "./schemas";

// tslint:disable:object-literal-sort-keys
// tslint:disable-next-line:no-var-requires
const { CALL_API } = require("redux-api-middleware");

const baseUrl = "http://localhost:5000/api/v1";

export default {
    loadCurrentUser: () => {
        const endpoint = `${baseUrl}/users/me`;
        return (dispatch) => dispatch(getCallApiAction(endpoint, schemas.user));
    },
    loadCommunity: (communityId) => {
        const endpoint = `${baseUrl}/communities/${communityId}`;
        return (dispatch) => dispatch(getCallApiAction(endpoint, schemas.communityList));
    },
    loadNewerPosts: (communityId, afterDateTime) => {
        const endpoint = `${baseUrl}/communities/${communityId}/posts?after=${afterDateTime}`;
        return (dispatch) => dispatch(getCallApiAction(endpoint, schemas.postList));
    },
    loadOlderPosts: (communityId, beforeDateTime, limit) => {
        const endpoint = `${baseUrl}/communities/${communityId}/posts?before=${beforeDateTime}&limit=${limit}`;
        return (dispatch) => dispatch(getCallApiAction(endpoint, schemas.postList));
    },
};

function getCallApiAction(endpoint, responseSchema) {
    return ({
        [CALL_API]: {
            endpoint,
            method: "GET",
            types: [
                "REQUEST",
                {
                    meta: { schema: responseSchema },
                    type: "SUCCESS",
                },
                {
                    meta: (action, state, res) => {
                        if (res) {
                            return {
                                status: res.status,
                                statusText: res.statusText,
                            };
                        } else {
                            return {
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
