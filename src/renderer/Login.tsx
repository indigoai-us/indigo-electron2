import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/512x512.png';
import './App.css'
import { useAppStore } from '../../lib/store';
import { useAuth, useSignIn, useUser } from '@clerk/clerk-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginIncorrect, setLoginIncorrect] = useState(false);
  const navigate = useNavigate();
  const { fetchCommands } = useAppStore()
  const emailRef = useRef<HTMLInputElement | null>(null);
  const { getToken } = useAuth();
  const location = useLocation();
  const [signInToken, setSignInToken] = useState(null);
  const { signIn, setActive } = useSignIn();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<any>(null);

  window.electron.ipcRenderer.send('log', 
    { level: 'error', message: 'loading login', object: 'this log is in Login component load' }
  );

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      600, // width
      700  // height
    )
  }, []);

  useEffect(() => {
    
    const trySignIn = async () => {      
      try {
        console.log('user: ', user);
        if(user) {
          navigate('/');
          return;
        } else {
          const token = location?.state?.token;
          console.log('token: ', token);
          if(token) {
            const signInResponse = await signIn?.create({strategy: 'ticket', ticket: token});
            console.log('signInResponse: ', signInResponse);
            if(setActive) {
              await setActive({
                session: signInResponse?.createdSessionId,
              });
            } else {
              console.log('no setActive');
            }
            setUser(signInResponse?.userData);
            return;
          }
        }
      } catch (error: any) {
        console.log('error: ', error);
      }
    }
    trySignIn();
  }, [location, user, setActive]);

  useEffect(() => {
    if(clerkUser) {
      setUser(clerkUser);
    }
  }, [clerkUser]);

  return (
    <div className={`main flex flex-col items-center justify-center h-screen`}>
      <div className='flex flex-row justify-center items-center'>
        <img width="40" alt="IndigoAI" src={logo} />
        <div className='text-5xl ml-2 relative bottom-1'>Indigo</div>
      </div>
      <div className='text-center text-sm mt-6'>
        {/* <SignIn redirectUrl="/" signUpUrl="/sign-up"/> */}
        <a
          href="https://app2.getindigo.ai/desktop-auth"
          target="_blank"
          rel="noreferrer"
        >
          <button
            className='mt-2 mb-2 bg-indigo-700 rounded-md px-4 py-2 transition-all hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none w-200'
          >
            Authenticate
          </button>
        </a>
      </div>
      <div className='flex-col content-center mt-4'>
        <a
          href="https://app.getindigo.ai/create-account"
          target="_blank"
          rel="noreferrer"
        >
          <div className='text-center text-sm mt-2'>
            Create Account
          </div>
        </a>
        <a
          href="https://app.getindigo.ai/login"
          target="_blank"
          rel="noreferrer"
        >
          <div className='text-center text-sm mt-1' style={{opacity: '50%'}}>
            Forgot Password
          </div>
        </a>
      </div>
      {loginIncorrect &&
        <div className='bg-red-600 rounded-xl py-1 mt-4 text-center text-sm'>
          <i>Incorrect login/password</i>
        </div>
      }
    </div>
  );
};

export default Login;
