import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from '../store/Contexts/AuthContext';

const useAuth = () => {
    const { user } = useContext(AuthContext);
    // console.log("user ",user);
    // console.log("isAuthenticated ",isAuthenticated);
    return user 
}

const ProtectRoute = ({children}) => {
    const isAuth = useAuth();
    console.log("isAuth ",isAuth);
    const location = useLocation();
  return !isAuth ? children : <Navigate to="/" replace state={{from: location}} /> 
  // react router v6


}
export default ProtectRoute;
