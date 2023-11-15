/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

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
    const openSpecificComponent = () => {
      console.log('opening chat...');
      navigate('/job');
    };
  
    window.electron.ipcRenderer.on('open-chat', openSpecificComponent);
  
    return () => {
      window.electron.ipcRenderer.removeListener('open-chat', openSpecificComponent);
    };
  }, [navigate]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
