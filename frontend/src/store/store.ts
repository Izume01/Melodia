import { create } from "zustand";

export interface PlayerSong {
    id: string;
    title: string;
    imageUrl: string | null;
}

interface CachedUrl {
    url: string;
    fetchedAt: number;
    userId: string;
}

// Presigned URLs typically expire in 1 hour, we'll refresh after 50 minutes to be safe
const URL_EXPIRY_MS = 50 * 60 * 1000;

interface PlayerState {
    currentSong: PlayerSong | null;
    audioUrl: string | null;
    currentUserId: string | null;

    isPlaying: boolean;
    isLoading: boolean;
    duration: number;
    currentTime: number;

    audioRef: HTMLAudioElement | null;
    signedUrlCache: Map<string, CachedUrl>;

    play: (song?: PlayerSong, userId?: string) => Promise<void>;
    pause: () => void;
    seek: (time: number) => void;
    stop: () => void;
    setIsPlaying: (playing: boolean) => void;
    setDuration: (duration: number) => void;
    setCurrentTime: (time: number) => void;
    setAudioRef: (audio: HTMLAudioElement) => void;
    clearCache: () => void;
    clearUserCache: (userId: string) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentSong: null,
    audioUrl: null,
    currentUserId: null,
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,

    audioRef: null,
    signedUrlCache: new Map(),

    play: async (song?: PlayerSong, userId?: string) => {
        const state = get();
        
        // Resume current song
        if (!song && state.currentSong) {
            set({ isPlaying: true });
            return;
        }

        if (!song) return;

        // Check if same song and URL is still valid, just resume
        if (song.id === state.currentSong?.id && state.audioUrl) {
            const cached = state.signedUrlCache.get(song.id);
            if (cached && Date.now() - cached.fetchedAt < URL_EXPIRY_MS) {
                set({ isPlaying: true });
                return;
            }
        }

        set({ isLoading: true, currentUserId: userId || state.currentUserId });

        // Check cache for valid URL
        const cached = state.signedUrlCache.get(song.id);
        let url: string | null = null;

        if (cached && Date.now() - cached.fetchedAt < URL_EXPIRY_MS) {
            // URL is still valid
            url = cached.url;
        } else {
            // Fetch new signed URL
            try {
                const res = await fetch(`/api/song/${song.id}/signed-url`);
                if (!res.ok) throw new Error("Failed to fetch signed URL");

                const data = await res.json();
                if (typeof data?.url !== "string" || data.url.length === 0) {
                    throw new Error("No signed URL available for this song.");
                }
                
                url = data.url;

                // Update cache with new URL and timestamp
                const newCache = new Map(get().signedUrlCache);
                newCache.set(song.id, {
                    url: data.url,
                    fetchedAt: Date.now(),
                    userId: userId || state.currentUserId || "anonymous",
                });
                set({ signedUrlCache: newCache });
            } catch (error) {
                set({ isLoading: false });
                throw error;
            }
        }

        // Stop any existing audio before switching
        const existingAudio = state.audioRef;
        if (existingAudio) {
            existingAudio.pause();
            existingAudio.currentTime = 0;
        }

        // Media Session API
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artwork: song.imageUrl
                    ? [{ src: song.imageUrl, sizes: "512x512", type: "image/png" }]
                    : [],
            });

            navigator.mediaSession.setActionHandler("play", () => {
                set({ isPlaying: true });
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                set({ isPlaying: false });
            });
            navigator.mediaSession.setActionHandler("seekbackward", () =>
                get().seek(Math.max(0, get().currentTime - 10))
            );
            navigator.mediaSession.setActionHandler("seekforward", () =>
                get().seek(Math.min(get().duration, get().currentTime + 10))
            );
        }

        set({
            currentSong: song,
            audioUrl: url,
            isPlaying: true,
            isLoading: false,
            currentTime: 0,
            duration: 0,
        });
    },

    pause: () => {
        set({ isPlaying: false });
    },

    stop: () => {
        const audio = get().audioRef;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        set({ 
            isPlaying: false, 
            currentSong: null, 
            audioUrl: null,
            currentTime: 0,
            duration: 0,
        });
    },

    seek: (time: number) => {
        const audio = get().audioRef;
        if (!audio) return;
        audio.currentTime = time;
        set({ currentTime: time });
    },

    setIsPlaying: (playing: boolean) => {
        set({ isPlaying: playing });
    },

    setDuration: (duration: number) => {
        set({ duration });
    },

    setCurrentTime: (time: number) => {
        set({ currentTime: time });
    },

    setAudioRef: (audio: HTMLAudioElement) => {
        set({ audioRef: audio });
    },

    clearCache: () => {
        set({ signedUrlCache: new Map() });
    },

    clearUserCache: (userId: string) => {
        const cache = get().signedUrlCache;
        const newCache = new Map<string, CachedUrl>();
        cache.forEach((value, key) => {
            if (value.userId !== userId) {
                newCache.set(key, value);
            }
        });
        set({ signedUrlCache: newCache });
    },
}));
