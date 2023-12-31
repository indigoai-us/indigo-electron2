'use client';
import { useEffect, useRef } from 'react';
import Message from './Message';

  const TextAreaInput = ({ onSubmit, textAreaRef, loading, input, setInput, formRef }: any) => {
    useEffect(() => {
      const form = formRef.current;
      if (form) {
        form.addEventListener('submit', onSubmit);
        return () => {
          form.removeEventListener('submit', onSubmit);
        };
      }
    }, [formRef, onSubmit]);

    return (
      <form className='relative px-10 mt-8' ref={formRef} onSubmit={onSubmit}>
        <div className="grow-wrap">
          <textarea
            ref = {textAreaRef}
            disabled = {loading}
            autoFocus = {false}
            placeholder="Ask..."
            value={input}
            onInput={(e) => {
              const parent = e.currentTarget.parentNode as HTMLElement;
              if (parent && parent.dataset) {
                parent.dataset.replicatedValue = e.currentTarget.value;
              }
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            onChange={(e) => setInput(e.target.value)}
            className="textarea w-full py-3 px-4 bg-transparent text-slate-200"
          />
        </div>
        <div className="flex flex-row items-center">
          <button
            type="submit"
            className='mt-2 mb-2 bg-indigo-700 rounded-md px-4 py-2 transition-all hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none w-200'
            disabled = {loading}
          >
            Generate
          </button>
          <div className="ml-2 text-indigo-500">{window.navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl'}+Enter</div>
        </div>
      </form>
    )
  };

export default function JobPlaygroundLayout({
  messageListRef,
  messages,
  setLoading,
  onSubmit,
  textAreaRef,
  loading,
  input,
  setInput,
  finishMessage,
}: any) {
  const formRef = useRef<HTMLFormElement>(null);

  // useEffect(() => {
  //   if (textAreaRef.current) {
  //     textAreaRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages]);

  const handleKeyPress = async (event: any) => {
    if((window.navigator.userAgent.includes('Mac') && event.metaKey && event.key === 'Enter') || (!window.navigator.userAgent.includes('Mac') && event.ctrlKey && event.key === 'Enter')) {
      console.log('ctrl+enter pressed: ', formRef.current);
      
      if (formRef.current) {
        console.log('formRef.current exists and is being run... ');
        const formEvent = new Event('submit', { cancelable: true });
        formRef.current.dispatchEvent(formEvent);
      }
    }
  };

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <div className="cloud flex-grow overflow-y-auto">
        <div
          ref={messageListRef}
          className="messagelist"
          style={{flexDirection: 'column-reverse'}}
        >
          {messages.length === 0 &&
            <TextAreaInput
              onSubmit = {onSubmit}
              textAreaRef = {textAreaRef}
              loading = {loading}
              input = {input}
              setInput = {setInput}
              formRef = {formRef}
            />
          }
          {messages.map((message: any, index: number) => {
            return (
              <>
                <Message
                  key={message.index}
                  input={message.input}
                  index={message.index}
                  messageType={message.messageType}
                  id={message.id}
                  job={message.job}
                  setTopLevelLoading={setLoading}
                  finishMessage={finishMessage}
                />
                {message.messageType === 'existing_api' && index === messages.length-1 &&
                  <TextAreaInput
                    onSubmit = {onSubmit}
                    textAreaRef = {textAreaRef}
                    loading = {loading}
                    input = {input}
                    setInput = {setInput}
                    formRef = {formRef}
                  />
                }
              </>
            )
          })}
        </div>
      </div>
    </>
  );
}
