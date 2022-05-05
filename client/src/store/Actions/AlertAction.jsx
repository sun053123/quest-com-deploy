import { ALERT_SHOW, ALERT_HIDE } from "../TypeConstants";

export const AlertShow = (alerts) => ({
    type: ALERT_SHOW,
    payload: alerts
});

export const AlertHide = () => ({
    type: ALERT_HIDE
});
