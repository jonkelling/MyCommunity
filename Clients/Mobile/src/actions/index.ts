
import * as constants from "../constants/index";
// const {PUSH} = require("redux-little-router");

export function updateContactInformation(contactInfo: any) {
    return (dispatch, getState) => {
        dispatch({
            type: constants.UPDATE_CONTACT_INFORMATION,
            // data: contactInfo,
        });
    };
}

export const SUBMIT_REGISTRATION = "SUBMIT_REGISTRATION";
export const SUBMIT_LOGINNAME = "SUBMIT_LOGINNAME";
export const SUBMIT_EMAIL = "SUBMIT_EMAIL";
export const SHOW_REGISTRATION_FORM = "SHOW_REGISTRATION_FORM";
export const LOGOUT = "LOGOUT";
export const AUTHENTICATED = "AUTHENTICATED";
export const FETCH_PROVIDERS = "FETCH_PROVIDERS";

// export const push = (path: string) => ({ type: PUSH, payload: path });
