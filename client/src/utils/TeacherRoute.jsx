import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from '../store/Contexts/AuthContext';

const useAuth = () => {
    const { userinfo } = useContext(AuthContext);
    
    console.log("userinfo on teacher protected route :", userinfo);
    if (userinfo && userinfo?.role === true) {
        return true;
    } else {
        return false;
    }
}

const ProtectRoute = () => {
    const isAuth = useAuth();
    const location = useLocation();

    //if user role === true (only teacher can aceess)
    return isAuth ? <Outlet /> : <Navigate to="/" replace state={{from: location}} /> 
    // react router v6
}

export default ProtectRoute;
