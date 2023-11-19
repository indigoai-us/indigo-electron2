import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import RunJob from '../components/job/RunJob';
import createJob from '../utils/createJob';
import { useAppStore } from '../../lib/store';

const Job = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const { models, fetchModels } = useAppStore()
  const [localModels, setLocalModels] = useState(models);
  const [openEnded, setOpenEnded] = useState(false);
  const [command, setCommand] = useState<any | null>(null);

  useEffect(() => {
    if(models.length === 0) {
      fetchModels()
    }
    setLocalModels(models)
  }, [models])

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      1080, // height
      768  // width
    )

    console.log('location.state: ', location.state);
    if(location?.state?.command) {      
      setCommand(location.state.command);
    }
    if(location?.state?.id) {      
      setId(location.state.id);
    }

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
      {(command || id) &&
        <RunJob
          command={command}
          id={id}
        />
      }

    </div>
  );
};

export default Job;
