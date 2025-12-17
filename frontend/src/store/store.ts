import { create } from 'zustand';

// Dashboard Store
interface DashboardStore {
    triggerGroupValue: string;
    setTriggerGroupValue: (value: string) => void;
}

const useStore = create<DashboardStore>((set) => ({
    triggerGroupValue: 'left',
    setTriggerGroupValue: (value: string) => set({ triggerGroupValue: value }),
}));

export default useStore;

// Player Store
export interface PlayerSong {
    id: string
    title: string
    imageUrl: string | null
}

export interface PlayerState {
    currentSong: PlayerSong | null

    // states
    isPlaying: boolean
    duration: number
    currentTime: number

    // internal
    audio: HTMLAudioElement | null
    signedUrlCache: Map<string, string>

    // actions
    play: (song: PlayerSong) => Promise<void>
    pause: () => void
    seek: (time: number) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,

    audio: null,
    signedUrlCache: new Map<string, string>(),

    play: async (song: PlayerSong) => {
        let audio = get().audio

        if (!audio) {
            audio = new Audio()
        }

        let url = get().signedUrlCache.get(song.id)

        if (!url) {
            const res = await fetch(`/api/song/${song.id}/signed-url`)

            if (!res.ok) {
                throw new Error(`Unable to fetch signed URL: ${res.statusText}`)
            }

            const data = await res.json()
            url = data.url as string

            get().signedUrlCache.set(song.id, url)
        }

        audio.src = url
        audio.preload = 'metadata'


        audio.onloadedmetadata = () => {
            set({ duration: audio!.duration });
        };

        // time update → running time
        audio.ontimeupdate = () => {
            set({ currentTime: audio!.currentTime });
        };

        audio.onended = () => {
            set({ isPlaying: false, currentTime: 0 });
        };

        await audio.play();

        set({
            audio,
            currentSong: song,
            isPlaying: true,
        });
    },

    pause: () => {
        const audio = get().audio
        audio?.pause();
        set({ isPlaying: false });
    },

    seek: (time: number) => {
        const audio = get().audio;
        if (!audio) return;

        audio.currentTime = time;
        set({ currentTime: time });
    }
}))