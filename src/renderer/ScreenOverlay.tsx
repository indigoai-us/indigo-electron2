import { useCallback, useEffect, useState } from 'react';
import './overlay.css'
import Selecto from "react-selecto";
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom';

const ScreenOverlay = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      1200, // height
      800, // width
      true
    )
  }, []);
  
  const takeScreenshot = (dimens: any) => {
    window.electron.ipcRenderer.send(
      'take-screenshot',
      dimens
    )
  }

  useEffect(() => {
    const handleScreenshot = async (screenshot: any) => {
      
      let imgData = new Blob([screenshot], { type: 'image/png' });
      const filename = uuidv4()+'.png';
      const newFile = new File([imgData], filename, { type: "image/png" })

      try {
        await Storage.put(filename, newFile, {
          contentType: "image/png", // contentType is optional
        });
        navigate('/job',{state: {img: filename}})

      } catch (error) {
        console.log("Error uploading file: ", error);
      }

    };
  
    const removeListener = window.electron.ipcRenderer.onScreenshotCaptured(handleScreenshot);
  
    // Clean up the event listener when the component unmounts
    return () => {
      removeListener();
    };
  }, []);

  return (
    <div className="overlay">
        <Selecto
            dragContainer={".overlay"}
            selectableTargets={[".selecto-area .cube"]}
            hitRate={100}
            selectByClick={true}
            selectFromInside={true}
            ratio={0}
            onSelectStart={e => {
              console.log('onSelectStart e: ', e);                  
            }}
            onSelectEnd={e => {
              console.log('onSelectEnd e: ', e.rect);
              takeScreenshot(e.rect);
            }}
        ></Selecto>

        <div className="selecto-area" id="selecto1">

        </div>
    </div>
  );
};

export default ScreenOverlay;
