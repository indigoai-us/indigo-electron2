import { useEffect, useRef, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import './App.css'
import { useAppStore } from '../../lib/store';

const HandleOAuth = () => {
  const navigate = useNavigate();
  // const { fetchCommands } = useAppStore()

  useEffect(() => {

  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      600, // width
      600  // height
    )
  }, []);


  return (
    <div className='main flex flex-col items-center justify-center h-screen'>
    
    </div>
  );
};

export default HandleOAuth;
