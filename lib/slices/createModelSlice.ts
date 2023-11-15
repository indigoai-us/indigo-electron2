import { API } from "aws-amplify";
import { Auth } from "aws-amplify";
import { StateCreator } from "zustand";

export interface Model {
    _id: any;
    nameCode: any;
    name: string;
    icon: string;
    active: boolean;
}

export interface ModelSlice {
    models: Model[];
    fetchModels: () => void;
    clearModels: () => void;
}

export const createModelSlice: StateCreator<ModelSlice> = (set) => ({
  models: [],
    fetchModels: async () => {
      const user = await Auth.currentAuthenticatedUser();
      const modelsData = await API.get('be1', '/models', {
        headers: {
          custom_header: `Bearer ${user.signInUserSession.idToken.jwtToken}`, // get jwtToken
        }
      }).catch((error: any) => console.log(error.response));
      const models = modelsData?.data;
      console.log('zustand createModelsSlice models: ', models);
      set({ models })
    },
    clearModels: () => set({ models: [] }),
})
