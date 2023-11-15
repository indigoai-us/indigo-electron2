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

    if(location?.state?.id) {
      setId(location.state.id);
    } else {
      const handleNoId = async () => {

        const gpt4Model = localModels.find(model => model.nameCode === "gpt-4-32k");
        console.log('gpt4Model: ', gpt4Model);

        const newCommand = {
          name: "General Chat",
          // model: gpt4Model ? gpt4Model._id : '65554737057cde6fb32d1119',
          model: '65554737057cde6fb32d1119',
          tokens: 4096,
          temperature: 0.5,
          systemMessage: "",
          promptFrame: "I am starting an open ended chat session. For your first response, please only state that you are the new GPT 4 Turbo model and ask what you can do to help me. {copied}",
          rawPromptFrame: "I am starting an open ended chat session. For your first response, please only state that you are the new GPT 4 Turbo model and ask what you can do to help me. @[{copied}](copied)",
          showSystemMessage: false,
          usesCopied: true,
          data: []
        }
        const job = await createJob({command: newCommand});
        console.log('job: ', job);
        setId(job.id);
      }
      handleNoId();
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
      {id &&
        <RunJob
          id={id}
        />
      }

    </div>
  );
};

export default Job;
