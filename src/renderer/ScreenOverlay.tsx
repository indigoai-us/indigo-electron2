import { useCallback, useEffect, useState } from 'react';
import './overlay.css'
import Selecto from "react-selecto";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

//@ts-ignore
console.log('window.envVars.AWS_ACCESS_KEY_ID: ', window.envVars.AWS_ACCESS_KEY_ID);
//@ts-ignore
console.log('window.envVars.AWS_SECRET_ACCESS_KEY: ', window.envVars.AWS_SECRET_ACCESS_KEY);

const client = new S3Client({ 
  region: "us-east-1",
  credentials: {
    //@ts-ignore
    accessKeyId: window.envVars.AWS_ACCESS_KEY_ID,
    //@ts-ignore
    secretAccessKey: window.envVars.AWS_SECRET_ACCESS_KEY
  }
}); // replace REGION with your AWS region

const ScreenOverlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { commands } = useAppStore()

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      1200, // height
      800, // width
      true,
      true
    )
    
  }, []);
  
  useEffect(() => {
    if(commands) {
      const visionCommands = commands.filter((command: any) => command.model.nameCode==='gpt-4-vision-preview');
      if(visionCommands.length === 0) {
        navigate('/oops-error', {
          state: {
            message: 'No vision commands found',
            suggestion: 'You can create a vision command in the web app!',
            link: 'https://app.getindigo.ai/library/command/new',
            linkText: 'Do it now',
          }
        })
      }
    }

  }, [commands]);

  const takeScreenshot = (dimens: any) => {
    window.electron.ipcRenderer.send('log', 
      { level: 'error', message: 'taking screenshot', object: dimens }
    );
    window.electron.ipcRenderer.send(
      'take-screenshot',
      dimens
    )
  }

  useEffect(() => {
    const handleScreenshot = async ({img, dimens, screenWidth, screenHeight}: any) => {

      try {

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

          const command = new PutObjectCommand({
            Bucket: "indigo-vision-images190143-dev", // replace BUCKET_NAME with your bucket name
            Key: "public/"+filename, // replace FILE_NAME with the name you want to give to the file
            Body: newFile, // replace FILE_CONTENT with the content of the file
          });

          const response = await client.send(command);
          console.log("Success", response);          

          // const storedFile = await Storage.put(filename, newFile, {
          //   contentType: "image/png", // contentType is optional
          // });
  
          const storedFileUrl = 'https://indigo-vision-images190143-dev.s3.amazonaws.com/public/'+filename;
  
          console.log('storedFile: ', storedFileUrl);
  
          console.log('ScreenOverlay location state: ', location?.state);        
  
          // navigate('/vision-job',{state: {img: storedFileUrl}})
          navigate('/',{state: {img: storedFileUrl, command: location?.state?.command, copied: location?.state?.copied}})
  
        } catch (error: any) {
          console.log("Error uploading file: ", error);
          navigate('/oops-error', {
            state: {
              message: 'Oops! Something went wrong.',
              suggestion: error.message
            }
          })
  
        }

      } catch (error: any) {
        console.log('handleScreenshot error: ', error);

        navigate('/oops-error', {
          state: {
            message: 'Oops! Something went wrong.',
            suggestion: error.message
          }
        })

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
