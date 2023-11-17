import { useCallback, useEffect, useState } from 'react';
import './overlay.css'
import Selecto from "react-selecto";
import screenshot from 'screenshot-desktop';

const ScreenOverlay = () => {

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
    const handleScreenshot = (screenshot: any) => {
      // Do something with the screenshot
      console.log('screenshot: ', screenshot);
      
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
