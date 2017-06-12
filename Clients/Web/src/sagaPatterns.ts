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

export function locationChangedToPathNamePattern(pathname: string) {
    return locationChangedPattern((action) =>
        action &&
        action.payload.pathname === pathname
    );
}

export function metaSourcePattern(source: string, type?: string) {
    return (action) => (
        action &&
        (!type || action.type === type) &&
        action.meta &&
        action.meta.source === source
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
