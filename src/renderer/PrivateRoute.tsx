/* eslint-disable react/jsx-props-no-spreading */
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export default function PrivateRoute({ children, ...rest }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setIsAuthenticated(true);
        return user;
      })
      .catch((err) => {
        setIsAuthenticated(false);
      });
  }, []);
  console.log('isAuthenticated: ', isAuthenticated);

  useEffect(() => {
    const openRoute = (data: any) => {
      console.log('opening route: /', data.route);
      navigate(`/${data.route}`);
    };
  
    window.electron.ipcRenderer.on('open-route', openRoute);

    return () => {
      window.electron.ipcRenderer.removeListener('open-route', openRoute);
    };
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
