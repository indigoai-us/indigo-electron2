import { useCallback, useEffect, useRef, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/IndigoLogoHorizontal2.png';
import './App.css'
import createJob from '../utils/createJob';
import getClip from '../utils/getClip';
import IconArrowDown from './icons/IconArrowDown';
import IconArrowUp from './icons/IconArrowUp';
import IconEsc from './icons/IconEsc';
import { useAppStore } from '../../lib/store';

const Commands = () => {
  const [baseCommands, setBaseCommands] = useState([]);
  // const [commands, setCommands] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const commandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { commands, fetchCommands, jobs, fetchJobs } = useAppStore()
  const [localCommands, setLocalCommands] = useState(commands);

  useEffect(() => {
    if(commands.length === 0) {
      fetchCommands()
    }
    setLocalCommands(commands)
  }, [commands])

  useEffect(() => {
    if(jobs.length === 0) {
      fetchJobs()
    }
  }, [jobs])

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  // const getCommands = async () => {

  //   try {
  //     const user = await Auth.currentAuthenticatedUser();
  //     const recipes = await API.get('be1', '/recipes', {
  //       headers: {
  //         custom_header: `Bearer ${user?.signInUserSession?.accessToken?.jwtToken}`, // get jwtToken
  //       },
  //     }).catch((error: any) => console.log(error.response));
  //     console.log('recipes: ', recipes);
  //     setBaseCommands(recipes.data);
  //     setCommands(recipes.data);
  //   } catch (error) {
  //     console.log('error signing in', error);
  //   }
  // }

  useEffect(() => {
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
      fetchCommands();
    }
    if(event.key === 'Enter') {
      const command = commands[highlightedIndex];
      command && runCommand(command);
    }
    if(event.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => {
        const newIndex = prevIndex >= 0 ? Math.min(prevIndex + 1, localCommands.length - 1) : 0;
        commandRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return newIndex;
      });
    }
    if(event.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        commandRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return newIndex;
      });
    }


  }, [commands, highlightedIndex]);

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if(search === '') {
      setLocalCommands(commands);
    } else {
      const filteredCommands = search ? commands.filter((command: any) => {
        return command.name.toLowerCase().includes(search.toLowerCase());
      }) : baseCommands;
      setLocalCommands(filteredCommands);
    }
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
      {/* Input Field */}
      <div className='flex-none w-full'>
        <input
          name="search"
          ref={inputRef}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full px-4 py-2 mt-2 text-gray-300 bg-gray-950  outline-none"
          placeholder='Start typing to find a command...'
        />
      </div>
      <div>
        {error && <div className='text-red-500'>{error}</div>}
      </div>
      {/* Command List */}
      <div className="grow overflow-auto w-full p-2 h-full command-list">
        {localCommands.map((command: any, index: number) => (
          <div
            key={command.id}
            id={command._id}
            className={`p-2 cursor-pointer flex justify-between command ${highlightedIndex === index ? 'command-highlighted' : ''}`}
            onClick={() => runCommand(command)}
            ref={(el) => commandRefs.current[index] = el}
          >
            <div className='flex items-center'>
              <h1 className='text-sm'>{command.name}</h1>
              {command.usesCopied &&
                <div className='text-xs px-1.5 py-0.5 bg-gray-700 align-middle h-5 ml-3 mt-1'>Copied</div>
              }
            </div>
            <div>
              {/* <h1>{index}</h1> */}
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-row justify-around w-full py-4 text-xs text-gray-600'>
        <div>
          <span className='mr-2 text-gray-300'>
          {window.navigator.userAgent.includes('Mac') ? '⌘+r' : 'ctrl+r'}
          </span>
          <span className='text-gray-400'>Refresh</span>
        </div>
        <div>
          <span className='mr-2 flex flex-row'>
            <span><IconArrowDown /></span>
            <span className='mr-2'><IconArrowUp /></span>
            <span className='text-gray-400'>Navigate</span>
          </span>

        </div>
        <div className='flex flex-row'>
          <span className='mr-2'><IconEsc/></span>
          <span className='text-gray-400'>Close</span>
        </div>
        <button className='text-gray-300' type="button" onClick={handleLogout}>
          Logout
        </button>
        <button className='text-gray-300' type="button" onClick={() => navigate('/history')}>
          History
        </button>
      </div>
    </div>
  );
};

export default Commands;
