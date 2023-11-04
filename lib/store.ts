// store.ts

import create from 'zustand'
import { createCommandSlice, CommandSlice } from './slices/createCommandSlice'
import { persist } from 'zustand/middleware'

type StoreState = CommandSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCommandSlice(...a),
    }),
    { name: 'bound-store' }
  )
)
