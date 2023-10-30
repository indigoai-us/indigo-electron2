import { useCallback, useEffect, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/IndigoLogoHorizontal2.png';
import './App.css'
import createJob from '../utils/createJob';
import getClip from '../utils/getClip';

const Commands = () => {
  const [baseCommands, setBaseCommands] = useState([]);
  const [commands, setCommands] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getCommands = async () => {

    try {
      const user = await Auth.currentAuthenticatedUser();
      const recipes = await API.get('be1', '/recipes', {
        headers: {
          custom_header: `Bearer ${user?.signInUserSession?.accessToken?.jwtToken}`, // get jwtToken
        },
      }).catch((error: any) => console.log(error.response));
      console.log('recipes: ', recipes);
      setBaseCommands(recipes.data);
      setCommands(recipes.data);
    } catch (error) {
      console.log('error signing in', error);
    }
  }

  useEffect(() => {
    getCommands();
    window.electron.ipcRenderer.send(
      'window-resize',
      600, // height
      400  // width
    )
  }, []);

  const handleKeyPress = useCallback((event: any) => {
    let newArray = Array.from({ length: 10 }, (value, index) => index);

    if(event.altKey && newArray.includes(parseInt(event.key))) {
      const command = commands[parseInt(event.key)];
      command && runCommand(command);
    }
    if(event.ctrlKey && event.key === 'r') {
      getCommands();
    }
    if(event.arrowDown) {
      console.log('arrowDown pressed');
    }
  }, [commands]);

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const filteredCommands = search ? baseCommands.filter((command: any) => {
      return command.name.toLowerCase().includes(search.toLowerCase());
    }) : baseCommands;
    setCommands(filteredCommands);
  }, [search]);

  const runCommand = async (command: any) => {
    const clipContents = await getClip();
    if(clipContents === '') {
      setError('Clipboard is empty');
      return;
    }
    if(command.inputs.length > 0) {
      navigate('/inputs',{state: {...command, copied: clipContents}})
    } else {
      const job = await createJob({command});
      console.log('job: ', job);

      navigate('/job',{state: job})
    }

  }

  const handleLogout = async () => {
    try {
      const loggedOut = await Auth.signOut();
      console.log('loggedOut: ', loggedOut);
      navigate('/login');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <div className='flex flex-col items-center h-screen justify-between'>
      <div className='flex-none w-full'>
        <input
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full px-4 py-2 mt-2 text-slate-300 backdrop-brightness-90 bg-transparent outline-none"
          placeholder='Start typing to find a command...'
        />
      </div>
      <div>
        {error && <div className='text-red-500'>{error}</div>}
      </div>
      <div className="grow overflow-auto w-full p-2 h-full">
        {commands.map((command: any, index: number) => (
          <div
            key={command.id}
            id={command._id}
            className='p-2 hover:bg-indigo-700 cursor-pointer flex justify-between'
            onClick={() => runCommand(command)}
          >
            <div className='flex items-center'>
              <h1>{command.name}</h1>
              {command.usesCopied &&
                <div className='text-xs px-2 bg-gray-700 align-middle h-5 ml-3 mt-1'>Copied</div>
              }
              {command.inputs.length === 0 &&
                <div className='text-xs px-2 bg-gray-700 align-middle h-5 ml-3 mt-1'>No Inputs</div>
              }
            </div>
            <div>
              <h1>{index}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-row justify-around w-full'>
        <div>
          Ctrl+R
        </div>
        <div>
          Alt+#
        </div>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
        <button type="button" onClick={() => navigate('/history')}>
          History
        </button>
      </div>
    </div>
  );
};

export default Commands;
