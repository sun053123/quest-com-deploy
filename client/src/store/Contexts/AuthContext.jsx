import { createContext, useEffect, useReducer } from 'react';
import jwt_decode from 'jwt-decode';

import  AuthReducer  from '../Reducers/AuthReducer';
import setAuthToken from '../../utils/setAuthToken';
import { Logout, SetUserInfo } from "../Actions/AuthAction";


const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    userinfo: jwt_decode(JSON.parse(localStorage.getItem("user"))) || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthProvider = ({ children }) => {
    const [state, AuthDispatch] = useReducer(AuthReducer, INITIAL_STATE);

    //check if token was expired
    const checkExpiredToken = () => {
        const token = JSON.parse(localStorage.getItem('user'));
        // console.log(token.token)
        if (token) {
            const decoded = jwt_decode(token);
            if (decoded.exp < Date.now() / 1000) {
                localStorage.removeItem('user');
                console.log('token expired');
                return AuthDispatch(
                    Logout()
                );
            }
            return 
        }
        return 
    }

    //set token to local storage
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
        checkExpiredToken();
        
    }, [state.user]);

    //set token to state
    if(state.user) {
        // console.log("token set axios",state.user);
        setAuthToken(state.user);
    }


    return (
        <AuthContext.Provider value={{
            user: state.user,
            userinfo: state.userinfo,
            isAuthenticated: state.isAuthenticated,
            isLoading: state.isLoading,
            error: state.error,
            AuthDispatch: AuthDispatch
         }}>
            {children}
        </AuthContext.Provider>
    );
};
    