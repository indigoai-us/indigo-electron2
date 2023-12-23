import { API, Auth } from "aws-amplify";
import getClip from "./getClip";
import { v4 as uuidv4 } from "uuid";
import useFetch from "./useFetch";

const createJob = async ({command, img, getToken}: any) => {
  // console.log('createJob', command);

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

  // const user = await Auth.currentAuthenticatedUser();
  // const createdJob = await API.post('be1', '/jobs', {
  //   headers: {
  //     custom_header: `Bearer ${user?.signInUserSession?.accessToken?.jwtToken}`, // get jwtToken
  //   },
  //   body
  // }).catch((error: any) => console.log(error.response));

  console.log('createdJob', createdJob);

  return createdJob;

}

export default createJob;
