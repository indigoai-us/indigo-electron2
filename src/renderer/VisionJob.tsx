import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import RunJob from '../components/job/RunJob';
import { useAppStore } from '../../lib/store';

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

const VisionJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { models, fetchModels } = useAppStore()
  const [localModels, setLocalModels] = useState(models);
  const [openEnded, setOpenEnded] = useState(false);
  const [command, setCommand] = useState<any>(null);
  const [img, setImg] = useState<any>(location?.state?.img);

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

    const handleImg = async () => {
      const newCommand = {
        ...baseCommand,
        name: "Vision Chat",
        model: '65591b9c057cde6fb32d111a',
        vision: true
      }
      setCommand(newCommand);
      setImg(location?.state?.img);
    }
    handleImg();

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
      {command && img &&
        <RunJob
          command={command}
          openEnded={openEnded}
          img={img}
        />
      }

    </div>
  );
};

export default VisionJob;
