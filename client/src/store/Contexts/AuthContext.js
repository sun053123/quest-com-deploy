import { createContext, useEffect, useReducer } from 'react';
import  AuthReducer  from '../Reducers/AuthReducer';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { Logout } from "../Action/AuthAction";


const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, AuthDispatch] = useReducer(AuthReducer, INITIAL_STATE);

    const checkExpiredToken = () => {
        const token = JSON.parse(localStorage.getItem('user'));
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

    
    useEffect(() => {

        localStorage.setItem("user", JSON.stringify(state.user));
        checkExpiredToken();
        
    }, [state.user]);

    if(state.user) {
        setAuthToken(state.user.token);
    }

    return (
        <AuthContextProvider.Provider value={{
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            isLoading: state.isLoading,
            error: state.error,
            dispatch: AuthDispatch
         }}>
            {children}
        </AuthContextProvider.Provider>
    );
};
    