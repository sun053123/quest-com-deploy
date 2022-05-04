const { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } = require("../TypeConstants");


export const LoginStart = () => ({
    type: LOGIN_START,
});

export const LoginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user
});

export const LoginFailure = () => ({
    type: LOGIN_FAIL,
});

export const Logout = () => ({
    type: LOGOUT,
});

