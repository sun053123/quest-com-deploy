const { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SET_USERINFO } = require("../TypeConstants");


export const LoginStart = () => ({
    type: LOGIN_START,
});

export const LoginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user
});

export const SetUserInfo = (userinfo) => ({
    type: SET_USERINFO,
    payload: userinfo
});

export const LoginFailure = () => ({
    type: LOGIN_FAIL,
});

export const Logout = () => ({
    type: LOGOUT,
});

