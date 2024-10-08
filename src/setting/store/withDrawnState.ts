import { create } from 'zustand'
import { CounterState } from './counterState'

export const useWithDrawnState = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 }))
}))
