// store.ts

import create from 'zustand'
import { createCommandSlice, CommandSlice } from './slices/createCommandSlice'
import { persist } from 'zustand/middleware'
import { createHistorySlice, HistorySlice } from './slices/createHistorySlice'
import { createModelSlice, ModelSlice } from './slices/createModelSlice'

type StoreState = CommandSlice & HistorySlice & ModelSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCommandSlice(...a),
      ...createHistorySlice(...a),
      ...createModelSlice(...a),
    }),
    { name: 'bound-store' }
  )
)
