// store.ts

import create from 'zustand'
import { createCommandSlice, CommandSlice } from './slices/createCommandSlice'
import { persist } from 'zustand/middleware'
import { createHistorySlice, HistorySlice } from './slices/createHistorySlice'
import { createModelSlice, ModelSlice } from './slices/createModelSlice'
import { createSessionSlice, SessionSlice } from './slices/createSessionSlice'

type StoreState = CommandSlice & HistorySlice & ModelSlice & SessionSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCommandSlice(...a),
      ...createHistorySlice(...a),
      ...createModelSlice(...a),
      ...createSessionSlice(...a),
    }),
    { name: 'bound-store' }
  )
)
