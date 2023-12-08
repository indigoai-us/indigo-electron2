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
import { Modal } from '../shadcn/modal';
import IconImage from '../../renderer/icons/IconImage';
import JobChatLayout from './JobChatLayout';
import JobPlaygroundLayout from './JobPlaygroundLayout';
import IconChatBubble from '../../renderer/icons/IconChatBubble';
import IconFormBubble from '../../renderer/icons/IconFormBubble';
import handleGoBack from '../../utils/handleGoBack';
import IconList from '../../renderer/icons/IconList';

export default function RunJob({id, openEnded, resetChat, command, img}: any) {
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
  const [chatLayout, setChatLayout] = useState(false);
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
      console.log('img: ', img);

      console.log('id: ', id);

      const newJob = id ? await getExistingJob(id) : await createJob({command, img});

      setJob(newJob);

      console.log('newJob', newJob);

      if(!newJob.command._id) {
        setIsOpenEnded(true);
      }

      let prompt = newJob.promptFrame ? newJob.promptFrame : newJob.prompt_frame;

      newJob.data.forEach((d: any) => {
        prompt = prompt.replace(`{${d.name}}`, d.selectedOption?.value);
      });

      prompt = prompt.replace(`{copied}`, newJob.copied);

      setOriginalPrompt(prompt);

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

        const newUserMessage = {
          index: 0,
          input: prompt,
          messageType: 'user'
        }

        const newApiMessage = {
          index: 1,
          input,
          messageType: 'initial',
          id,
          job: newJob
        }

        setMessages([...messages, newUserMessage, newApiMessage]);
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

  const finishMessage = ({index, output}: any) => {

    const newMessages = messages.map((message: any) => {
      if(message.index === index) {
        message.input = output;
        message.messageType = 'existing_api'
      }
      return message;
    })

    setMessages(newMessages);
  }

  return (
    <main className={`main flex flex-col h-screen overflow-x-hidden`}>
      {chatLayout ?
          <JobChatLayout
            messageListRef = {messageListRef}
            messages = {messages}
            setLoading = {setLoading}
            onSubmit = {onSubmit}
            textAreaRef = {textAreaRef}
            loading = {loading}
            input = {input}
            setInput = {setInput}
            job = {job}
            isOpenEnded = {isOpenEnded}
            handleResetChat = {handleResetChat}
            finishMessage = {finishMessage}
          />
        :
          <JobPlaygroundLayout
            messageListRef = {messageListRef}
            messages = {messages}
            setLoading = {setLoading}
            onSubmit = {onSubmit}
            textAreaRef = {textAreaRef}
            loading = {loading}
            input = {input}
            setInput = {setInput}
            job = {job}
            isOpenEnded = {isOpenEnded}
            handleResetChat = {handleResetChat}
            finishMessage = {finishMessage}
          />
      }

      <ToastContainer />

      <div className="flex flex-row">
        <div onClick={() => handleGoBack({navigate})} className='flex flex-row flex-grow text-white cursor-pointer my-4 mx-8 w-auto'>
            <span className='mr-2 w-auto'><IconBack/></span>
            <span className='text-gray-400 text-xs'>Back</span>
        </div>
        <div onClick={() => navigate('/history')} className='flex flex-row text-white cursor-pointer my-4 mx-8 w-auto'>
            <span className='mr-2 w-auto'><IconList /></span>
            <span className='text-gray-400 text-xs'>Command List</span>
        </div>
        <div onClick={() => setChatLayout(!chatLayout)} className='flex flex-row text-white cursor-pointer my-4 mx-8 w-auto'>
            <span className='mr-2 w-auto'>{chatLayout ? <IconFormBubble/> : <IconChatBubble/>}</span>
            <span className='text-gray-400 text-xs'>{chatLayout ? 'Playground Mode' : ' Classic Chat'}</span>
        </div>
        {job?.img &&
          <a href={job.img} target="_blank" className='flex flex-row text-white cursor-pointer my-4 mx-8 w-auto'>
            <span className='mr-2 w-auto'><IconImage/></span>
            <span className='text-gray-400 text-xs'>View Image</span>
          </a>
        }
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
