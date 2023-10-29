import { useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';

const Inputs = ({command}: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    console.log('command: ', location.state);
    setInputs(location.state.inputs);
  }, [location]);

  return (
    <div>
      <div className='flex flex-col items-center h-screen justify-around'>
        {inputs.map((input: any) => {
          return (
            <div>
              <label>{input.name}</label>
              <input type={input.type} />
            </div>
          )
        })}
      </div>
      <div onClick={() => navigate(-1)} className='fixed bottom-2 left-2 text-white-500 cursor-pointer'>
        Go Back
      </div>
    </div>
  );
};

export default Inputs;
