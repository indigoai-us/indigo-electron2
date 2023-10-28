import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Amplify, Auth, API } from 'aws-amplify';
import config from '../aws-exports-with-auth';
import icon from '../../assets/icon.svg';
import './App.css';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

Amplify.configure({ ...config });

function Hello() {
  const navigate = useNavigate();

  const testApi = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const userData = await API.get('be1', '/users', {
      headers: {
        custom_header: `Bearer ${user?.signInUserSession?.accessToken?.jwtToken}`, // get jwtToken
      },
    }).catch((error: any) => console.log(error.response));
    console.log('userData: ', userData);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      navigate('/login');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate2</h1>
      <button type="button" onClick={testApi}>
        Test API
      </button>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => console.log({ user }))
      .catch((err) => console.log({ err }));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<PrivateRoute/>}>
          <Route path="/" element={<Hello />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
