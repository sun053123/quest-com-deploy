/* eslint-disable no-lone-blocks */
import jwt_decode from 'jwt-decode';
const { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SET_USERINFO } = require("../TypeConstants");

const AuthReducer = (state, action) => {

    const { type, payload } = action;

    switch (type) {
        case LOGIN_START: {
            return {
                user: null,
                userinfo: null,
                isLoading: true,
                error: null
            };
        };
        case LOGIN_SUCCESS: {
            return {
                user: payload,
                userinfo: jwt_decode(payload),
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        };
        case LOGIN_FAIL: {
            return {
                user: null,
                userinfo: null,
                isLoading: false,
                error: payload
            };
        };
        case LOGOUT: {
            return {
                user: null,
                userinfo: null,
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

