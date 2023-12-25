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

    const finishSignInToken = (payload: any) => {
      navigate('/login',
      {
        state: { token: payload.token }
      })
    };
  
    window.electron.ipcRenderer.on('sign-in-token', finishSignInToken);
  
    return () => {
      window.electron.ipcRenderer.removeListener('open-route', openRoute);
      window.electron.ipcRenderer.removeListener('sign-in-token', finishSignInToken);
    };
  }, [navigate]);

  useEffect(() => {
    console.log('privateRoute user: ', user);
  }, [user]);    

  return isLoaded ? (user ? <Outlet /> : <Navigate to="/login" />) : null;
}
