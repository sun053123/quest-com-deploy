/* eslint-disable no-lone-blocks */
const { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } = require("../TypeConstants");

const AuthReducer = (state, action) => {

    const { type, payload } = action;

    switch (type) {
        case LOGIN_START: {
            return {
                user: null,
                isLoading: true,
                error: null
            };
        };
        case LOGIN_SUCCESS: {
            return {
                user: payload,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        };
        case LOGIN_FAIL: {
            return {
                user: null,
                isLoading: false,
                error: payload
            };
        };
        case LOGOUT: {
            return {
                user: null,
                isLoading: false,
                error: null
            };
        };
        default: {
            return state;
        }
    }
}

export default AuthReducer;

