// store.ts

import create from 'zustand'
import { createCommandSlice, CommandSlice } from './slices/createCommandSlice'
import { persist } from 'zustand/middleware'
import { createHistorySlice, HistorySlice } from './slices/createHistorySlice'

type StoreState = CommandSlice & HistorySlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCommandSlice(...a),
      ...createHistorySlice(...a),
    }),
    { name: 'bound-store' }
  )
)
