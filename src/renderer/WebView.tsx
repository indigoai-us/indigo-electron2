import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';

const WebView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      900, // height
      600  // width
    )
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

  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/?id=' : 'https://indigowebview.diffuze.ai/?id=';
  const url = baseUrl + location.state.id;
  console.log('url: ', url);

  return (
    <div>
      {url &&
        <iframe
          allow="clipboard-read; clipboard-write"
          title='WebView'
          src={url}
          height={580}
          width={900}
        />
      }
      <div onClick={() => navigate(-1)} className='fixed bottom-2 left-2 text-white-500 cursor-pointer'>
        Go Back
      </div>
    </div>
  );
};

export default WebView;
