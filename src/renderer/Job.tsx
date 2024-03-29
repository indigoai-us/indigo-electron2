import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import RunJob from '../components/job/RunJob';
import { useAppStore } from '../../lib/store';
import { useAuth } from '@clerk/clerk-react';

const baseCommand = {
  tokens: 4096,
  temperature: 0.5,
  systemMessage: "",
  promptFrame: "{copied}",
  rawPromptFrame: "@[{copied}](copied)",
  showSystemMessage: false,
  usesCopied: true,
  data: []
}

const Job = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const { models, fetchModels } = useAppStore()
  const [localModels, setLocalModels] = useState(models);
  const [openEnded, setOpenEnded] = useState(false);
  const [command, setCommand] = useState<any | null>(null);
  const [img, setImg] = useState<any | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if(models.length === 0) {
      fetchModels(getToken)
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
    if(location?.state?.img) {
      setImg(location.state.img);
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
  console.log('jobimage: ', location?.state?.img)
  return (
    <div>
      {(command || id) &&
        <RunJob
          command={command}
          id={id}
          img={location?.state?.img}
        />
      }

    </div>
  );
};

export default Job;
