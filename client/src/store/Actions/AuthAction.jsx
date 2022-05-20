const { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, UPDATE_USER } = require("../TypeConstants");


export const LoginStart = () => ({
    
    type: LOGIN_START,
});

export const LoginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user
});

export const UpdateUser = (userinfo) => ({
    type: UPDATE_USER,
    payload: userinfo
});

export const LoginFailure = () => ({
    type: LOGIN_FAIL,
});

export const Logout = () => ({
    type: LOGOUT,
});
