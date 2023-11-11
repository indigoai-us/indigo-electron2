import { API } from "aws-amplify";
import { Auth } from "aws-amplify";
import { StateCreator } from "zustand";

export interface Command {
    inputs: any;
    name: string;
    _id: string;
    usesCopied: boolean;
}

export interface CommandSlice {
    commands: Command[];
    fetchCommands: () => void;
    clearCommands: () => void;
}

export const createCommandSlice: StateCreator<CommandSlice> = (set) => ({
    commands: [],
    fetchCommands: async () => {
      const user = await Auth.currentAuthenticatedUser();
      const commandsData = await API.get('be1', '/recipes', {
        headers: {
          custom_header: `Bearer ${user.signInUserSession.idToken.jwtToken}`, // get jwtToken
        },
        queryStringParameters: {sub: user.attributes.sub}
      }).catch((error: any) => console.log(error.response));
      const commands = commandsData?.data;
      console.log('zustand createCommandsSlice commands: ', commands);
      set({ commands })
    },
    clearCommands: () => set({ commands: [] }),
})
