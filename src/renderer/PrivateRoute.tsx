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

  useEffect(() => {
    const openCommands = () => {
      console.log('opening commands...');
      navigate('/');
    };
  
    window.electron.ipcRenderer.on('open-commands', openCommands);
  
    return () => {
      window.electron.ipcRenderer.removeListener('open-commands', openCommands);
    };
  }, [navigate]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
