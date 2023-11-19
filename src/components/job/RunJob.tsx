'use client';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Message from './Message';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import IconBack from '../../renderer/icons/IconBack';
import IconHistory from '../../renderer/icons/IconHistory';
import IconRefresh from '../../renderer/icons/IconRefresh';
import createJob from '../../utils/createJob';

export default function RunJob({id, openEnded, resetChat, command}: any) {
  const [stream, setStream] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [gettingJob, setGettingJob] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [job, setJob] = useState<any | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLInputElement>(null);
  const [isOpenEnded, setIsOpenEnded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(command || id) {
      handleJob();
    }
  }, [command, id]);
  
  const getExistingJob = async (id: any) => {
    const url = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://indigo-api-dev.diffuze.ai';

    try {

      const res = await fetch(`${url}/jobs?id=`+id, {
        method: 'GET'
      });
      const {data} = await res.json();
      // console.log('job data', data[0]);

      if(data[0]) {
        return data[0] ? data[0] : [];
      } else {
        setError('No job found with that id');
      }

    } catch (e: any) {
      console.error(e);
    }

  }

  const handleJob = async () => {

    try {

      console.log('command: ', command);
      
      const newJob = id ? await getExistingJob(id) : await createJob({command});

      setJob(newJob);

      console.log('newJob', newJob);

      if(!newJob.command._id) {
        setIsOpenEnded(true);
      }
      
      let prompt = newJob.promptFrame ? newJob.promptFrame : newJob.prompt_frame;

      newJob.data.forEach((d: any) => {
        const objectKey = Object.keys(input)[0];
        prompt = prompt.replace(`{${objectKey}}`, d[objectKey]);
      });

      prompt = prompt.replace(`[copied]`, newJob.copied);

      setOriginalPrompt(prompt);

      console.log('openEnded: ', openEnded);
      
      if(newJob.messages) {
        const formattedMessages = newJob.messages.map((message: any, index: number) => {
          if(message.type==='human') {
            return {
              index,
              input: message.data.content,
              messageType: 'user'
            }
          } else {
            return {
              index,
              input: message.data.content,
              messageType: 'existing_api',
              id,
              job: newJob
            }
          }
        })
        setMessages(formattedMessages);
      } else if (!openEnded) {
        const newApiMessage = {
          index: messages.length,
          input,
          messageType: 'initial',
          id,
          job: newJob
        }

        setMessages([...messages, newApiMessage]);
      }

    } catch (e: any) {
      console.error(e);
    }
  }

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (null === messageList) {
      throw Error('messageList is null')
    }
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    if (null === textAreaRef.current) {
      throw Error('textAreaRef is null')
    }
    textAreaRef.current.focus();
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const newUserMessage = {
        index: messages.length,
        input,
        messageType: 'user'
      }

      const newApiMessage = {
        index: messages.length+1,
        input,
        messageType: 'api',
        id: id ? id : job.id,
        job
      }

      console.log('newApiMessage', newApiMessage);

      setMessages([...messages, newUserMessage, newApiMessage]);
      setInput('');
    },
    [input, stream, messages]
  );

  const openHistory = async () => {
    const createdBy = job ? job.createdBy : null;
    console.log('createdBy', createdBy);

    if(job) {
      navigate('/history' + '?' + 'user=' + createdBy)
    }
  }

  useEffect(() => {
    if (!loading) {
      textAreaRef.current?.focus();
    }
  }, [loading]);

  const handleResetChat = () => {
    setMessages([]);
    resetChat && resetChat();
    textAreaRef.current?.focus();
  }

  return (
    <main className="main flex flex-col h-screen overflow-x-hidden">
      {/* <button onClick={getJob}>
        Get Initial Job
      </button> */}
      {/* <div className = {styles.originalPrompt}>
        {originalPrompt}
      </div> */}
      <div className="cloud flex-grow overflow-y-auto">
        <div
          ref={messageListRef}
          className="messagelist"
        >
          {messages.map((message: any) => (
            <Message
              key={message.index}
              input={message.input}
              index={message.index}
              messageType={message.messageType}
              id={message.id}
              job={message.job}
              setTopLevelLoading={setLoading}
            />
          ))}
        </div>
      </div>

      <div className="center">

        <div className="cloudform px-4">
          <form className='relative' onSubmit={onSubmit}>
            <input
              ref = {textAreaRef}
              disabled = {loading}
              autoFocus = {false}
              type="text"
              placeholder="Ask..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="textarea w-full py-3 px-4 bg-gray-900 bg-opacity-40  rounded-lg"
            />
            <button
              type = "submit"
              disabled = {loading}
              className=" top-4 right-4 absolute"
            >
              <svg
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                className="svgicon"
              >
                <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
              </svg>
            </button>
          </form>
        </div>
        <ToastContainer />

      </div>
      <div className="flex flex-row">
      <div onClick={() => navigate(-1)} className='flex flex-row flex-grow text-white cursor-pointer my-4 mx-8 w-auto'>
          <span className='mr-2 w-auto'><IconBack/></span>
          <span className='text-gray-400 text-xs'>Back</span>
      </div>
      {isOpenEnded &&
        <div onClick={handleResetChat} className='flex flex-row text-white cursor-pointer my-4 mx-8 w-auto'>
          <span className='mr-2 w-auto'><IconRefresh/></span>
          <span className='text-gray-400 text-xs'>New Session</span>
        </div>  
      }
      <div onClick={() => navigate('/history')} className='flex flex-row text-white cursor-pointer my-4 mx-8 w-auto'>
          <span className='mr-2 w-auto'><IconHistory/></span>
          <span className='text-gray-400 text-xs'>History</span>
      </div>
      </div>
    </main>
  );
}
