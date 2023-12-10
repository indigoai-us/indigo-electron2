import { useLocation, useNavigate } from 'react-router-dom';
import image from '../../assets/images/oops-error2.png';
import IconBack from './icons/IconBack';
import { useEffect } from 'react';
import IconOpenInNew from './icons/IconOpenInNew';

const OopsError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      600, // height
      400  // width
    )
  }, []);

  return (
    <div className="main">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <div className="image-container">
            <img className="fade-image" width="200" alt="IndigoAI" src={image} />
          </div>
          {location?.state?.message && <p className="text-2xl mt-4">{location?.state?.message}</p>}
          {location?.state?.suggestion && <p className="text-md mt-1 text-gray-300">{location?.state?.suggestion}</p>}
          <div className="flex flex-row items-center justify-center mt-4">
            <div onClick={() => navigate('/')} className='flex flex-row flex-grow text-white cursor-pointer my-1 mx-4 w-auto'>
              <span className='mr-2 w-auto'><IconBack/></span>
              <span className='text-gray-400 text-xs'>Back to Commands</span>
            </div>
            {location?.state?.link &&
              <a href={location.state.link} target='_blank' className='flex flex-row flex-grow text-white cursor-pointer my-1 mx-4 w-auto'>
                <span className='mr-2 w-auto'><IconOpenInNew colorClass="text-gray-400" size={16}/></span>
                <span className='text-gray-400 text-xs'>{location?.state?.linkText}</span>
              </a>        
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default OopsError;