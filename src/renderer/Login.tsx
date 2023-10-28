import { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/IndigoLogoHorizontal2.png';
import './App.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log('login email: ', email);
    console.log('login password: ', password);
    try {
      await Auth.signIn(email, password).then((user: any) => {
        console.log('user: ', user);
        navigate('/');
        return user;
      });
    } catch (error) {
      console.log('error signing in', error);
    }
  };

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="IndigoAI" src={logo} />
      </div>
      <form className="mt-6" onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-normal text-slate-300"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 mt-2 text-slate-300 backdrop-brightness-90 bg-transparent outline-none  border rounded-md border-zinc-700 hover:border-zinc-500 focus:border-indigo-500  "
          />
          <label
            htmlFor="password"
            className="block text-sm font-normal text-slate-300 mt-3"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 mt-2 text-slate-300 backdrop-brightness-90 bg-transparent outline-none  border rounded-md border-zinc-700 hover:border-zinc-500 focus:border-indigo-500  "
          />
        </div>

        <div className="Hello">
          <button
            type="submit"
            className='bg-indigo-700 rounded-md px-4 py-2 transition-all hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none'
            style={{width: '100%'}}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
