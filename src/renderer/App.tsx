import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify, Auth, API } from 'aws-amplify';
import config from '../aws-exports-with-auth';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import './App.css'
import Commands from './Commands';
import JobsHistory from './history/JobsHistory';
import Job from './Job';
import CommandData from './CommandData';
import { log } from 'console';

Amplify.configure({ ...config });

export default function App() {
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => console.log({ user }))
      .catch((err) => console.log({ err }));
  }, []);

  useEffect(() => {
    console.log('window.environment: ', window.electron.environment);
    
    if (window.electron.environment === 'darwin') {
      document.body.classList.remove('windows');
    } else {
      document.body.classList.add('windows');
    }
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path="/" element={<Commands />} />
          </Route>
          <Route path='/data' element={<PrivateRoute/>}>
            <Route path="/data" element={<CommandData />} />
          </Route>
          <Route path='/job' element={<PrivateRoute/>}>
            <Route path="/job" element={<Job />} />
          </Route>
          <Route path='/history' element={<PrivateRoute/>}>
            <Route path="/history" element={<JobsHistory />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}
