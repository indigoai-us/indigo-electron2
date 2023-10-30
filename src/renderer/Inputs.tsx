import { useEffect, useState } from 'react';
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import createJob from '../utils/createJob';

const Inputs = ({command}: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    console.log('command: ', location.state);
    setInputs(location.state.inputs);
    setCopied(location.state.copied);
  }, [location]);

  const updateInput = (e: any, id: any) => {
    const newInputs : any = inputs.map((input: any) => {
      if(input._id === id) {
        const optionExists = input.options.find((option: any) => option.value === e.target.value);
        console.log('optionExists: ', optionExists);
        input.selectedOption = {
          id: optionExists ? optionExists._id : 'new',
          value: e.target.value
        }
        input.value = e.target.value;
      }
      return input;
    });
    console.log('newInputs: ', newInputs);

    setInputs(newInputs);
  }


  const submitJob = async () => {
    const command = location.state;
    const job = await createJob({command});
    navigate('/job',{state: job})
  }

  return (
    <div className='flex-col overflow-auto h-screen'>
      <div className='flex flex-col items-center justify-start'>
        {inputs.map((input: any, key: number) => {
          return (
            <div className='flex flex-col mt-3' key={key}>
              <label className='text-xs mb-1'>{input.name}</label>
              <input
                type="text"
                list={input._id}
                onChange={(e) => updateInput(e, input._id)}
                className='text-black'
              />
              <datalist id={input._id}>
                {input.options.map((option: any) =>
                  <option value={option.value}>{option.value}</option>
                )}
              </datalist>
            </div>
          )
        })}
        <label className='text-xs mb-1 text-white'>
          Clipboard
        </label>
        <div className='text-white text-xs mb-5'>
          {copied}
        </div>
      </div>
      <div className='flex flex-row justify-between items-center px-4'>
        <div onClick={() => navigate(-1)} className='inline-block text-white-500 cursor-pointer'>
          Go Back
        </div>
        <button
          type="button"
          className='mb-5 bg-indigo-700 rounded-md px-4 py-2 transition-all hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none'
          onClick={submitJob}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default Inputs;
