import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import RunJob from '../components/job/RunJob';

const Job = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      900, // height
      600  // width
    )
  }, []);

  const handleKeyPress = useCallback((event: any) => {
    if(event.altKey && event.key === 'ArrowLeft') {
      console.log('backspace');
      navigate(-1);
    }
  }, []);

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div>
      {location.state.id &&
        <RunJob
          id={location.state.id}
        />
      }
      <div onClick={() => navigate(-1)} className='fixed bottom-1 left-2 text-white-500 cursor-pointer'>
        Go Back
      </div>
    </div>
  );
};

export default Job;
