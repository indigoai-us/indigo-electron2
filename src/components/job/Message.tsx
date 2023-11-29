'use client';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css'
import { toast } from 'react-toastify';
import indigosmall from '../../../assets/icon.png';
import usericon from '../../../assets/images/usericon.png';

type MessageProps = {
  input: string;
  index: number;
  messageType: string;
  id: string;
  job: any;
  setTopLevelLoading: any;
  finishMessage: any;
};

const Message = (props: MessageProps) => {
  const { input, index, messageType, id, job, setTopLevelLoading, finishMessage } = props;
  const [stream, setStream] = useState(true);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [inflight, setInflight] = useState(false);
  const [error, setError] = useState('');
  const [controller, setController] = useState(new AbortController());
  const outputRef = useRef(output);

  useEffect(() => {
    outputRef.current = output;
  }, [output]);

  useEffect(() => {    
    if(messageType === 'user' || messageType === 'existing_api') {
      setOutput(input);
    } else {
      submitInput();
    }
  },[input])

  const handleFinishOutput = async(index: any) => {
    finishMessage({index, output: outputRef.current});
  }

  const submitInput = useCallback(
    async () => {

      // Prevent multiple requests at once
      if (inflight) return;

      // Reset output
      setInflight(true);
      setTopLevelLoading(true);
      setOutput('');

      try {

        const url = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8081'
        : 'https://2wmrri2cmh.us-east-1.awsapprunner.com';

        const body = JSON.stringify({
          input: messageType === 'initial'? null : input,
          job
        });
        // console.log('message body: ', body);

        const endpoint = job.img ? 'vision_chat' : 'webview_chat';
        
        await fetchEventSource(`${url}/${endpoint}`, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          openWhenHidden: true,
          signal: controller.signal,
          onmessage(ev) {
            // console.log('ev.data', ev.data);
            const nextToken = !ev.data ? '\n' : ev.data;
            setOutput((o) => {
              const newOutput = o + nextToken;
              outputRef.current = newOutput;
              return newOutput;
            });
          },
          onclose() {
            console.log('onclose');
            finishMessage({index, output: outputRef.current});
            setOutput((o) => {
              const newOutput = o === '' ? 'I\'m sorry, it appears that something has gone wrong. This is generally due to token limitations. Please resubmit your Command request.' : o;
              outputRef.current = newOutput;
              return newOutput;
            });          
          },
          onerror(ev) {
            console.log('onerror error', ev);
          }
        });
      } catch (error) {
        console.error('langchain error: ', error);
      } finally {
        setInflight(false);
        setTopLevelLoading(false);
      }
    },
    [input, stream, inflight, output]
  );

  const copyToClipboard = async() => {
    toast("📋 Copied to clipboard", {
      autoClose: 1000,
      theme: 'dark'
    });
    await navigator.clipboard.writeText(output);
  }

  const stopStream = () => {
    controller.abort();
    setController(new AbortController());
  }

  // const handleSubmitInput = async () => {
  //   await submitInput();
  //   handleFinishOutput(index);
  // }

  return (
    <div
      key={index}
      className={messageType === "user" && loading ? 'usermessagewaiting' : (messageType === "initial" || messageType === "api" || messageType === 'existing_api') ? "apimessage pt-4 pb-10 px-6 text-white text-sm" : "usermessage py-4 px-6 bg-gray-950 bg-opacity-60 text-gray-500 italic text-sm"}
    >
      {messageType === 'user' ? <img src = {usericon} alt = "User" width = "30" height = "30" className = "usericon" />
      : <img src = {indigosmall} alt = "AI" width = "30" height = "30" className = "boticon" />}
      <div className = "markdownanswer">
        {/* <ReactMarkdown
          remarkPlugins={[remarkMath, rehypeKatex]}
        > */}
        <code>
          {output}
        </code>
        {
          error !== '' &&
          <div style={{color: 'red', fontSize: 14, lineHeight: 2}}>
            {error}
          </div>
        }
        {/* </ReactMarkdown>   */}
      </div>
      {messageType !== 'user' &&
        <div style={{position: 'absolute', bottom: 25, right: 25, display: 'flex', color: '#6D5ACF'}} title="Copy">
          <div onClick={copyToClipboard}>
            <svg viewBox='0 0 115.77 122.88' className="svgiconbutton" xmlns='http://www.w3.org/2000/svg'>
              <path d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/>
            </svg>
          </div>
          {inflight &&
            <div onClick={stopStream} style={{marginLeft: 5, color: 'grey'}} title="Stop">
              <svg className="svgiconbutton" fill="#fff" height="19px" width="19px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297 297"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M148.5,0C66.486,0,0,66.486,0,148.5S66.486,297,148.5,297S297,230.514,297,148.5S230.514,0,148.5,0z M213.292,190.121 c0,12.912-10.467,23.379-23.378,23.379H106.67c-12.911,0-23.378-10.467-23.378-23.379v-83.242c0-12.912,10.467-23.379,23.378-23.379 h83.244c12.911,0,23.378,10.467,23.378,23.379V190.121z"></path> </g></svg>
            </div>        
          }
        </div>
      }
    </div>
  );
}

export default Message;
