import { create } from 'zustand'

interface StoreTypes {
    triggerGroupValue: string,
    setTriggerGroupValue: (value: string) => void
}

const initialValue = {
    triggerGroupValue: 'left',
}

const useStore = create<StoreTypes>((set) => ({
    ...initialValue,
    setTriggerGroupValue: (value: string) => {
        set(() => ({
            triggerGroupValue: value
        }))
    }
}))

export default useStore;