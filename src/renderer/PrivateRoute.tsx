/* eslint-disable react/jsx-props-no-spreading */
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export default function PrivateRoute({ children, ...rest }: any) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const openRoute = (payload: any) => {
      console.log('opening route: ', payload.route);
      navigate(`/${payload.route}`);
    };
  
    window.electron.ipcRenderer.on('open-route', openRoute);
  
    return () => {
      window.electron.ipcRenderer.removeListener('open-route', openRoute);
    };
  }, [navigate]);

  return isLoaded ? (user ? <Outlet /> : <Navigate to="/login" />) : null;
}
