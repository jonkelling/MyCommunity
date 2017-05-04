import * as schemas from "./schemas";

// tslint:disable:object-literal-sort-keys
// tslint:disable-next-line:no-var-requires
const { CALL_API } = require("redux-api-middleware");

export default {
    loadCurrentUser: (dispatch) => {
        const endpoint = "http://localhost:5000/api/v1/users/me";
        dispatch(getCallApiAction(endpoint, schemas.user));
    },
    loadCommunity: (dispatch, id) => {
        const endpoint = `http://localhost:5000/api/v1/communities/${id}`;
        dispatch(getCallApiAction(endpoint, schemas.communityList));
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
