import getClip from "./getClip";
import { v4 as uuidv4 } from "uuid";
import useFetch from "./useFetch";

const createJob = async ({command, img, getToken}: any) => {
  // console.log('createJob', command);
  try {
    const copied = await getClip();
    // console.log('copied', copied);
  
    const body = {
      command: command._id,
      data: command.data,
      prompt_frame: command.promptFrame,
      promptFrame: command.promptFrame,
      id: uuidv4(),
      free: command.free,
      systemMessage: command.systemMessage,
      model: command.model._id ? command.model._id : command.model,
      temperature: command.temperature,
      tokens: command.tokens,
      copied,
      img,
    };
  
    console.log('body', body);
  
    const createdJob = await useFetch('/jobs', 'POST', body, getToken);
  
    if(img) {
      const commandPatch = {
        lastImage: img,
      }
      const updatedCommand = await useFetch('/commands/'+command._id, 'PATCH', commandPatch, getToken);
      console.log('updatedCommand', updatedCommand);
      
    }
  
    console.log('createdJob', createdJob);
  
    return createdJob;
  } catch (error) {
    console.log('error', error);
    return error;
  }

}

export default createJob;
