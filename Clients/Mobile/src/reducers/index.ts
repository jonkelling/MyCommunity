import update from "immutability-helper";
import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    Middleware,
} from "redux";
import { Action, handleActions } from "redux-actions";
import * as actions from "../actions/index";

const app = handleActions(
    {
        [actions.SHOW_REGISTRATION_FORM]: (state, action) => {
            if (action.payload) {
                return { ...state };
            }
            return state;
        },
        [actions.LOGOUT]: (state) => {
            return { ...state, authToken: null };
        },
        [actions.AUTHENTICATED]: (state, action) => {
            if (action.payload) {
                return { ...state, authToken: action.payload };
            }
            return state;
        },
    }, {
        authenticated: true,
    },
);

function handleApiResponseActions(handlers) {
    return (state, action) => {
        if (!action.meta || !action.meta.source) {
            return state;
        }
        return handlers[action.meta.source](state, action);
    };
}

const entities = (state = {}, action) => {
  if (action.payload && action.payload.entities) {
    return { ...state, entities: action.payload.entities };
  }

  return state;
};

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action: Action<any>) {
    const { type, error } = action;

    if (type === "RESETERRMSG"/*ActionTypes.RESET_ERROR_MESSAGE*/) {
        return null;
    } else if (error) {
        return action.error;
    }

    return state;
}

// Updates the pagination data for different actions.
/*const pagination = combineReducers({
    starredByUser: paginate({
        mapActionToKey: action => action.login,
        types: [
            ActionTypes.STARRED_REQUEST,
            ActionTypes.STARRED_SUCCESS,
            ActionTypes.STARRED_FAILURE
        ]
    }),
    stargazersByRepo: paginate({
        mapActionToKey: action => action.fullName,
        types: [
            ActionTypes.STARGAZERS_REQUEST,
            ActionTypes.STARGAZERS_SUCCESS,
            ActionTypes.STARGAZERS_FAILURE
        ]
    })
})*/

const rootReducer = combineReducers({
    app,
    entities,
    // pagination,
    errorMessage,
});

export default rootReducer;