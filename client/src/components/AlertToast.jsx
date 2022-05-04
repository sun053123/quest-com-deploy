import React, { useContext } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AlertContext } from '../store/Contexts/AlertContext';

function AlertToast() {

    const { alerts } = useContext(AlertContext);

    console.log("art",alerts);

    // useEffect(() => {
    //     if (alerts) {
    //         toast.error(alerts.msg, {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //         AlertDispatch({ type: "ALERT_HIDE" });
    //     }
    // }, [alerts, AlertDispatch]);

    alerts != null && alerts.map(alert => {
        console.log("in AlertToast", alert.msg);
        toast.error(alert.msg, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
        return(<ToastContainer />)
        
    });
    
}

export default AlertToast
