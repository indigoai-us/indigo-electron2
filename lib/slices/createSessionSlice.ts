import { StateCreator } from "zustand";

export interface Session {
    screenCount: any;
}

export interface SessionSlice {
    session: Session | null;
    setSession: (session: any) => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  session: null,
  setSession: async (session: any) => {

    set({ session })
  },
})
