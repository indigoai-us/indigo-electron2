'use client';
import Message from './Message';

export default function JobChatLayout({
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

  return (
    <>
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
              finishMessage={finishMessage}
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
              className="textarea w-full py-3 px-4 bg-gray-900 bg-opacity-40 rounded-lg border-2 border-indigo-600 text-slate-200"
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
      </div>
    </>
  );
}
