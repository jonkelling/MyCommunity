import merge from "lodash.merge";
import { REHYDRATE } from "redux-persist/constants";
import * as actions from "../actions/index";
import appSettings from "../appSettings";

export default (state = {}, action) => {
    if (action.type === actions.REMOVE_AUTH_TOKEN ||
        action.type === actions.REFRESHING_TOKEN_FAILURE) {
        return {};
    }

    if (action.type === REHYDRATE) {
        const incoming = action.payload.entities;
        if (incoming) {
            return {
                ...state,
                ...excludeOldRecordsByDateReceived(incoming),
                loading: false
            };
        }
        return { ...state, loading: false };
    }

    if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities);
    }

    return state;
};

function excludeOldRecordsByDateReceived(entities) {
    entities = entities || {};
    const cutoffDateTime = new Date(new Date().valueOf() - (1000*60*60*24*appSettings.entityDataExpirationDays));
    return Object.keys(entities).reduce(r1(entities, cutoffDateTime), {});
}

function r1(entities, cutoffDateTime: Date) {
    return (prev, current, currentIndex, values) => {
        const entityTypeName = current;
        const entityType = entities[entityTypeName];
        if (typeof entityType !== "object") {
            return {
                ...prev,
                [entityTypeName]: entityType,
            };
        }
        return {
            ...prev,
            [entityTypeName]: Object.keys(entityType).reduce(r2(entityType, cutoffDateTime), {}),
        };
    };
}

function r2(entityValues, cutoffDateTime: Date) {
    return (prev, current, currentIndex, values) => {
        const entityKey = current;
        const entity = entityValues[entityKey];
        if (typeof entity !== "object") {
            return {
                ...prev,
                [entityKey]: entity,
            };
        }
        if (!entity.receivedDateTime || (new Date(entity.receivedDateTime).valueOf() < cutoffDateTime.valueOf())) {
            return { ...prev };
        }
        return {
            ...prev,
            [entityKey]: {
                ...entity,
            },
        };
    };
}
