'use client';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Message from './Message';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const runtime = 'edge';

export default function RunJob({id}: any) {
  const [stream, setStream] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [gettingJob, setGettingJob] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [job, setJob] = useState<any | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(id) {
      getJob();
    }
  }, [id]);

  const getJob = useCallback(
    async () => {

      setGettingJob(true)
      console.log('getJob id', id);

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
          setJob(data[0]);
        }

        const newJob = data[0];

        let prompt = newJob.promptFrame ? newJob.promptFrame : newJob.prompt_frame;

        newJob.inputs.forEach((input: any) => {
          const objectKey = Object.keys(input)[0];
          prompt = prompt.replace(`{${objectKey}}`, input[objectKey]);
        });

        prompt = prompt.replace(`[copied]`, newJob.copied);

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
        } else {
          const newApiMessage = {
            index: messages.length,
            input,
            messageType: 'initial',
            id,
            job: data[0]
          }

          setMessages([...messages, newApiMessage]);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setGettingJob(false);
      }
    },
    [id]
  );

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
        id,
        job
      }

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

  return (
    <main className="main">
      {/* <button onClick={getJob}>
        Get Initial Job
      </button> */}
      {/* <div className = {styles.originalPrompt}>
        {originalPrompt}
      </div> */}
      <div className="cloud">
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

        <div className="cloudform">
          <form onSubmit={onSubmit}>
            <input
              disabled = {loading}
              autoFocus = {false}
              type="text"
              placeholder="Ask..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="textarea"
              ref = {textAreaRef}
            />
            <button
              type = "submit"
              disabled = {loading}
              className="generatebutton"
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

    </main>
  );
}
