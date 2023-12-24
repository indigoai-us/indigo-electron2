import IconBack from "./icons/IconBack";
import image from '../../assets/images/oops-error2.png';
import IconOpenInNew from "./icons/IconOpenInNew";

const SignUp = () => {
    
    return (
      <div className="main">
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center">
            <div className="image-container">
              <img className="fade-image" width="200" alt="IndigoAI" src={image} />
            </div>
            <div className="flex flex-row items-center justify-center mt-4">
              <div className='flex flex-row flex-grow text-white cursor-pointer my-1 mx-4 w-auto'>
                <a href="https://app.getindigo.ai/sign-up" target='_blank' className='flex flex-row flex-grow text-white cursor-pointer my-1 mx-4 w-auto'>
                    <span className='mr-2 w-auto'><IconOpenInNew colorClass="text-gray-400" size={16}/></span>
                    <span className='text-gray-400 text-xs'>Sign up on web</span>
                </a>        
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignUp;