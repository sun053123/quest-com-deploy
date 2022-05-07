import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from '../store/Contexts/AuthContext';

const useAuth = () => {
    const { user } = useContext(AuthContext);
    // console.log("user ",user);
    // console.log("isAuthenticated ",isAuthenticated);
    return user 
}

const ProtectRoute = () => {
    const isAuth = useAuth();
    const location = useLocation();

  return isAuth ? <Outlet /> : <Navigate to="/login" replace state={{from: location}} /> 
  // react router v6


}
export default ProtectRoute;
