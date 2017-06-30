import { CALL_API } from "redux-api-middleware";
import { CALL_API_FSA } from "./actions";
import AuthService from "./auth/AuthService";

type ActionPredicateType = (action: any) => boolean;

export function metaSourcePattern(source: string | string[], ...type: string[]) {
    return (action) => (
        action &&
        (!type || equalsOrIn(action.type, type)) &&
        action.meta &&
        equalsOrIn(action.meta.source, source)
    );
}

export function callApiPattern(predicate: ActionPredicateType = null) {
    return (action) => (
        action &&
        (
            // action[CALL_API] ||
            action.type === CALL_API_FSA
        ) &&
        (!predicate || predicate(action))
    );
}

export function authShouldRenewPattern() {
    return (action) => (
        AuthService.getToken() &&
        (
            !AuthService.isAuthenticated() ||
            AuthService.isHalfWayToExpiration()
        )
    );
}

export function metaSchemaOrSourcePattern(key: string | string[], ...type: string[]) {
    return (action) =>
        (!type || equalsOrIn(action.type, type)) &&
        action.meta && (
            metaSourcePattern(key)(action) ||
            equalsOrIn(
                action.meta.schema &&
                (
                    action.meta.schema.key ||
                    (
                        action.meta.schema.schema &&
                        action.meta.schema.schema.key
                    )
                ),
                key
            )
        );
}

function hasTestFunction(value: any) {
    const test = value && value.test;
    return test && typeof test === "function";
}

function equalsOrIn(value, match: string | string[]) {
    if (!value) {
        return false;
    }
    if (typeof match === "string") {
        return value === match;
    }
    if (Array.isArray(match)) {
        return match.some((x) => x === value);
    }
    return false;
}
