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
    const openSpecificComponent = () => {
      console.log('opening chat...');
      navigate('/job');
    };
  
    window.electron.ipcRenderer.on('open-chat', openSpecificComponent);

    const openOverlayFunction = () => {
      console.log('opening overlay...');
      navigate('/overlay');
    };

    window.electron.ipcRenderer.on('open-overlay', openOverlayFunction);

    return () => {
      window.electron.ipcRenderer.removeListener('open-chat', openSpecificComponent);
      window.electron.ipcRenderer.removeListener('open-overlay', openOverlayFunction);
    };
    
  }, [navigate]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
