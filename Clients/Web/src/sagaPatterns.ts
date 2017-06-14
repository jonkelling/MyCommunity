import { CALL_API } from "redux-api-middleware";
import { ROUTER_LOCATION_CHANGED } from "./actions";
import { CALL_API_FSA } from "./actions";
import AuthService from "./auth/AuthService";

type ActionPredicateType = (action: any) => boolean;

export function locationRequiresAuthPattern() {
    return (action) => (
        action &&
        action.payload &&
        action.payload.result &&
        action.payload.result.auth
    );
}

export function locationChangedPattern(predicate: ActionPredicateType) {
    return (action) => (
        action &&
        action.type === ROUTER_LOCATION_CHANGED &&
        predicate(action)
    );
}

export function locationChangedToPathNamePattern(pathname) {
    return locationChangedPattern((action) =>
        action &&
        (
            (typeof pathname === "string" && action.payload.pathname === pathname) ||
            (typeof pathname === "function" && pathname(action.payload.pathname)) ||
            (hasTestFunction(pathname) && pathname.test(action.payload.pathname))
        )
    );
}

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
        !AuthService.isAuthenticated() ||
        AuthService.isHalfWayToExpiration()
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

function equalsOrIn(value: string, match: string | string[]) {
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
