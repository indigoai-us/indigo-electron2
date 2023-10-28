import { useEffect, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/IndigoLogoHorizontal2.png';
import './App.css'

const Commands = () => {
  const [baseCommands, setBaseCommands] = useState([]);
  const [commands, setCommands] = useState([]);
  const [search, setSearch] = useState('');

  const getCommands = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const recipes = await API.get('be1', '/recipes', {
      headers: {
        custom_header: `Bearer ${user?.signInUserSession?.accessToken?.jwtToken}`, // get jwtToken
      },
    }).catch((error: any) => console.log(error.response));
    console.log('recipes: ', recipes);
    setBaseCommands(recipes.data);
    setCommands(recipes.data);
  }

  useEffect(() => {
    getCommands();
  }, []);

  useEffect(() => {
    const filteredCommands = search ? baseCommands.filter((command: any) => {
      return command.name.toLowerCase().includes(search.toLowerCase());
    }) : baseCommands;
    setCommands(filteredCommands);
  }, [search]);

  return (
    <div className='w-full'>
      <div className='w-full'>
        <input
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full px-4 py-2 mt-2 text-slate-300 backdrop-brightness-90 bg-transparent outline-none  border rounded-md border-zinc-700 hover:border-zinc-500 focus:border-indigo-500  "
        />
      </div>
      <div className="max-h-40 overflow-auto">
        {commands.map((command: any) => (
          <div key={command.id}>
            <h1>{command.name}</h1>
            <p>{command.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Commands;
