import { API } from "aws-amplify";
import { Auth } from "aws-amplify";
import { StateCreator } from "zustand";

export interface Job {
    name: string;
    _id: string;
    usesCopied: boolean;
}

export interface HistorySlice {
    jobs: Job[];
    fetchJobs: () => void;
    clearJobs: () => void;
}

export const createHistorySlice: StateCreator<HistorySlice> = (set) => ({
  jobs: [],
    fetchJobs: async () => {
      const user = await Auth.currentAuthenticatedUser();
      const jobsData = await API.get('be1', '/jobs?grouped=true&createdBy='+user.attributes.sub, {
        headers: {
          custom_header: `Bearer ${user.signInUserSession.idToken.jwtToken}`, // get jwtToken
        }
      }).catch((error: any) => console.log(error.response));
      const jobs = jobsData?.data;
      console.log('zustand createHistorySlice jobs: ', jobs);
      set({ jobs })
    },
    clearJobs: () => set({ jobs: [] }),
})
