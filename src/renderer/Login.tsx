import { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import './App.css';
import { useNavigate } from 'react-router-dom';

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
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 mt-2 text-slate-300 backdrop-brightness-90 bg-transparent outline-none  border rounded-md border-zinc-700 hover:border-zinc-500 focus:border-indigo-500  "
          />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 mt-2 text-slate-300 backdrop-brightness-90 bg-transparent outline-none  border rounded-md border-zinc-700 hover:border-zinc-500 focus:border-indigo-500  "
          />
        </div>

        <div className="Hello">
          <button type="submit">
            <span role="img" aria-label="books">
              📚
            </span>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
