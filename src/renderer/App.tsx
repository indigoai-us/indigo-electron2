import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import './App.css'
import Commands from './Commands';
import JobsHistory from './history/JobsHistory';
import Job from './Job';
import CommandData from './CommandData';
import ScreenOverlay from './ScreenOverlay';
import VisionJob from './VisionJob';
import OpenChatJob from './OpenChatJob';
import OopsError from './OopsError';
import { ClerkProvider } from '@clerk/chrome-extension'
import SignUp from './SignUp';
import { dark } from '@clerk/themes';

//@ts-ignore
const PUBLISHABLE_KEY = window.envVars.CLERK_PUBLISHABLE_KEY || '';
console.log('PUBLISHABLE_KEY: ', PUBLISHABLE_KEY);

export default function App() {

  window.electron.ipcRenderer.send('log', 
    { level: 'error', message: 'loading app', object: PUBLISHABLE_KEY }
  );

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
      <ClerkProvider 
        publishableKey="pk_test_dGhhbmtmdWwtZmluY2gtODEuY2xlcmsuYWNjb3VudHMuZGV2JA" 
        appearance={{ baseTheme: dark }} 
      >
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
            <Route path='/open-chat' element={<PrivateRoute/>}>
              <Route path="/open-chat" element={<OpenChatJob />} />
            </Route>
            <Route path='/history' element={<PrivateRoute/>}>
              <Route path="/history" element={<JobsHistory />} />
            </Route>
            <Route path='/overlay' element={<PrivateRoute/>}>
              <Route path="/overlay" element={<ScreenOverlay />} />
            </Route>
            <Route path='/vision-job' element={<PrivateRoute/>}>
              <Route path="/vision-job" element={<VisionJob />} />
            </Route>
            <Route path="/oops-error" element={<OopsError />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ClerkProvider>
    </div>
  );
}
