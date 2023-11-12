import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import createJob from '../utils/createJob';
import IconBack from './icons/IconBack';

const CommandData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [copied, setCopied] = useState('');
  const [command, setCommand] = useState<any>(null);

  useEffect(() => {
    console.log('command: ', location.state);
    setData(location.state.data);
    setCopied(location.state.copied);
    setCommand(location.state);
    window.electron.ipcRenderer.send(
      'window-resize',
      600,  // width
      500 // height

    )
  }, [location]);

  // const handleKeyPress = useCallback((event: any) => {
  //   if(event.altKey && event.key === 'ArrowLeft') {
  //     console.log('backspace');
  //     navigate(-1);
  //   }
  // }, []);

  // useEffect(() => {
  //   // attach the event listener
  //   document.addEventListener('keydown', handleKeyPress);

  //   // remove the event listener
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, [handleKeyPress]);

  const updateData = (e: any, id: any) => {
    const newData : any = data.map((d: any) => {
      if(d._id === id) {
        const optionExists = d.options.find((option: any) => option.value === e.target.value);
        console.log('optionExists: ', optionExists);
        d.selectedOption = {
          id: optionExists ? optionExists._id : 'new',
          value: e.target.value
        }
        d.value = e.target.value;
      }
      return d;
    });
    console.log('newData: ', newData);

    setData(newData);
  }


  const submitJob = async () => {
    const command = location.state;
    const job = await createJob({command});
    navigate('/job',{state: job})
  }
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        submitJob();
      }
      if (event.key === 'ArrowLeft' && event.ctrlKey) {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handler);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [navigate]); // Add navigate to the dependency array
  return (
    <div className='flex flex-grow flex-col overflow-auto h-screen px-6 py-6'>

      {/* Command Name */}
      <div>
        <span className="text-md mr-2">{command?.name}</span>
        <span className='text-xs px-1.5 py-0.5 bg-gray-700 align-middle uppercase'>Clipboard</span>
      </div>

      {/* Data */}
      <div className='flex flex-col justify-start mt-2 flex-grow max-h-[100px] overflow-hidden'>
        {data.map((d: any, key: number) => {
          return (
            <div className='flex flex-col mt-3' key={key}>
              <label className='text-xs mb-1 '>{d.name}</label>
              <input
                type="text"
                list={d._id}
                onChange={(e) => updateData(e, d._id)}
                className='flex items-center gap-2.5 self-stretch border py-1.5 px-2 rounded-md border-solid text-sm input-field outline-none bg-gray-900 border-gray-800'
                autoFocus={key === 0} // Add this line
              />
              <datalist id={d._id}>
                {d.options.map((option: any) =>
                  <option value={option.value}>{option.value}</option>
                )}
              </datalist>
            </div>
          )
        })}

        {/* Clipboard */}
        <label className='text-xs mt-3 mb-1 text-white'>
          Clipboard
        </label>
        <div className='text-gray-500 text-xs mb-5 bg-gray-800 py-2 px-2 overflow-hidden h-auto max-h-10'>
          {copied}
        </div>
      </div>

      {/* Buttons */}
      <div className='flex flex-col items-center'>

        <button
          type="button"
          className='mb-2 bg-indigo-700 rounded-md px-4 py-2 transition-all hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none w-full'
          onClick={submitJob}
        >
          Generate
        </button>
        <div className='flex flex-row justify-around w-full text-xs text-gray-600 mb-5'>
          {window.navigator.userAgent.includes('Mac') ? '⌘+return' : 'ctrl+enter'}
        </div>
        <div onClick={() => navigate(-1)} className=' text-gray-600 cursor-pointer flex flex-row items-center'>

          <span className='mr-2'><IconBack/></span>
          <span className='text-gray-400 text-xs'>Back</span>

        </div>
      </div>
    </div>
  );
};

export default CommandData;
