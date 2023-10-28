/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import './App.css';

export default function PrivateRoute({ children, ...rest }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log('auth user: ', user);
        setIsAuthenticated(true);
        console.log({ user });
        return user;
      })
      .catch((err) => {
        console.log('auth err: ', err);
        setIsAuthenticated(false);
        console.log({ err });
      });
  }, []);
  console.log('isAuthenticated: ', isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
