
export default (store) => (next) => (action) => {
    const entities = action && action.payload && action.payload.entities;

    if (!entities) {
        return next(action);
    }

    const receivedDateTime = new Date().toUTCString();
    return next({
        ...action,
        payload: {
            ...action.payload,
            entities: Object.keys(entities).reduce(r1(entities, receivedDateTime), {}),
        },
    });
};

function r1(entities, receivedDateTime) {
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
            [entityTypeName]: Object.keys(entityType).reduce(r2(entityType, receivedDateTime), {}),
        };
    };
}

function r2(entityValues, receivedDateTime) {
    return (prev, current, currentIndex, values) => {
        const entityKey = current;
        const entity = entityValues[entityKey];
        if (typeof entity !== "object") {
            return {
                ...prev,
                [entityKey]: entity,
            };
        }
        if (entity.receivedDateTime) {
            return {
                ...prev,
                [entityKey]: {
                    ...entity,
                },
            };
        }
        return {
            ...prev,
            [entityKey]: {
                ...entity,
                receivedDateTime,
            },
        };
    };
}
