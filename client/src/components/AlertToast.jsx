import React, { useContext } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AlertContext } from '../store/Contexts/AlertContext';
import { AlertShow } from "../store/Actions/AlertAction";

function AlertToast() {

    const { alerts, AlertDispatch } = useContext(AlertContext);
    

    //after alert show, remove alert from store
    alerts != null && alerts?.forEach(alert => {
        toast(alert.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: alert.type,
            type: alert.type?alert.type:"error"
        });

        //remove alert from store
        setTimeout(() => {
            AlertDispatch(AlertShow(null, 'success'))
        }, 1000);
        
    })
    return (
        <ToastContainer />
    )

    // alerts != null && alerts?.map(alert => {
    //     console.log("in AlertToast", alert.msg);
    //     toast(alert.msg, {
    //                     position: "top-right",
    //                     autoClose: 3000,
    //                     hideProgressBar: false,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     progress: undefined,
    //                     type: alert.type?alert.type:"error"
    //                 });
    //     return(<ToastContainer />)
    // });
    

    
    
}

export default AlertToast
