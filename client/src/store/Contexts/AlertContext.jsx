import { createContext, useReducer } from "react";
import AlertReducer from "../Reducers/AlertReducer";

const INITIAL_ALERT_STATE = {
    alerts: null,
    isAlert: false
};

export const AlertContext = createContext(INITIAL_ALERT_STATE);

export const AlertProvider = ({ children }) => {
    const [state, AlertDispatch] = useReducer(AlertReducer, INITIAL_ALERT_STATE);

    return (
        <AlertContext.Provider value={{
            alerts: state.alerts,
            isAlert: state.isAlert,
            AlertDispatch
        }}>
            {children}
        </AlertContext.Provider>
    );
}
