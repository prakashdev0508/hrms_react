import { Navigate, Outlet } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

const PrivateRoute = () => {
  const accessToken = secureLocalStorage.getItem('accessTokenHRMS');
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
