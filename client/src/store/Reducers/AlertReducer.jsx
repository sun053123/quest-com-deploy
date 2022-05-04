import { ALERT_SHOW, ALERT_HIDE } from "../TypeConstants";

const AlertReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case ALERT_SHOW:
            return {
                alerts: payload,
                isAlert: true
            };
        case ALERT_HIDE:
            return {
                alerts: null,
                isAlert: false
            };
        default:
            return state;
    }
}

export default AlertReducer;
