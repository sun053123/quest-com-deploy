import React, { useContext } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AlertContext } from '../store/Contexts/AlertContext';

function AlertToast() {

    const { alerts } = useContext(AlertContext);
    
    // console.log("Alerts :",alerts);

    alerts != null && alerts.map(alert => {
        console.log("in AlertToast", alert.msg);
        toast(alert.msg, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        type: alert.type?alert.type:"error"
                    });
        return(<ToastContainer />)
    });
    
}

export default AlertToast
