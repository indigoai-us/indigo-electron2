import { API } from "aws-amplify";
import { Auth } from "aws-amplify";
import { StateCreator } from "zustand";
import useFetch from "../../src/utils/useFetch";

export interface Command {
    data: any;
    name: string;
    _id: string;
    usesCopied: boolean;
}

export interface CommandSlice {
    commands: Command[];
    fetchCommands: (getToken: any) => void;
    clearCommands: () => void;
}

export const createCommandSlice: StateCreator<CommandSlice> = (set) => ({
  commands: [],
  fetchCommands: async (getToken: any) => {
    const gotCommands = await useFetch('/commands', 'GET', null, getToken);
    console.log('zustand gotCommands commands: ', gotCommands);
    const commands = gotCommands?.data;
    set({ commands })
  },
  clearCommands: () => set({ commands: [] })
})
