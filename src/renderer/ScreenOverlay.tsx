import { useCallback, useEffect, useState } from 'react';
import './overlay.css'
import Selecto from "react-selecto";
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from 'react-router-dom';

const ScreenOverlay = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      1200, // height
      800, // width
      true,
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
    const handleScreenshot = async ({img, dimens, screenWidth, screenHeight}: any) => {
      console.log('handleScreenshot img: ', img);
      let imgData = new Blob([img], { type: 'image/png' });
      const filename = uuidv4()+'.png';

      // Create an image element
      const image = new Image();
      image.src = URL.createObjectURL(imgData);

      // Wait for the image to load
      await new Promise(resolve => {
        image.onload = resolve;
      });

      // Create a canvas and context
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      // Calculate the scale factor
      const scaleFactor = image.width / screenWidth;

      // Adjust the dimens values
      const adjustedDimens = {
        left: dimens.left * scaleFactor,
        top: dimens.top * scaleFactor,
        width: dimens.width * scaleFactor,
        height: dimens.height * scaleFactor
      };

      // Set the canvas dimensions to the dimensions of the crop area
      canvas.width = adjustedDimens.width;
      canvas.height = adjustedDimens.height;

      // Draw the image onto the canvas, but only the part within the crop area
      context.drawImage(image, adjustedDimens.left, adjustedDimens.top, adjustedDimens.width, adjustedDimens.height, 0, 0, adjustedDimens.width, adjustedDimens.height);

      // Convert the canvas back to a Blob
      const newImgData = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Blob creation failed'));
          }
        }, 'image/png');
      });

      const newFile = new File([newImgData], filename, { type: "image/png" })

      try {
        const storedFile = await Storage.put(filename, newFile, {
          contentType: "image/png", // contentType is optional
        });

        const storedFileUrl = 'https://indigo-vision-images190143-dev.s3.amazonaws.com/public/'+storedFile.key;

        console.log('storedFile: ', storedFileUrl);

        console.log('ScreenOverlay location state: ', location?.state);        

        // navigate('/vision-job',{state: {img: storedFileUrl}})
        navigate('/',{state: {img: storedFileUrl, command: location?.state?.command, copied: location?.state?.copied}})

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
