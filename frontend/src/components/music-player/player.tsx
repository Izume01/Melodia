"use client";

import React, { useRef, useEffect, useCallback } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { usePlayerStore } from "~/store/store";
import { useSidebar } from "~/components/ui/sidebar";

const Player = () => {
    const playerRef = useRef<AudioPlayer>(null);
    const lastTimeUpdate = useRef<number>(0);
    
    const { isMobile, open } = useSidebar();
    
    const currentSong = usePlayerStore((s) => s.currentSong);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const audioUrl = usePlayerStore((s) => s.audioUrl);
    const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
    const setDuration = usePlayerStore((s) => s.setDuration);
    const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
    const setAudioRef = usePlayerStore((s) => s.setAudioRef);

    // Calculate sidebar width - offcanvas mode means 0 when collapsed
    const sidebarWidth = isMobile || !open ? "0px" : "16rem";

    // Set audio ref when player mounts
    useEffect(() => {
        const audio = playerRef.current?.audio?.current;
        if (audio) {
            setAudioRef(audio);
        }
    }, [setAudioRef]);

    // Sync play state with store
    useEffect(() => {
        const audio = playerRef.current?.audio?.current;
        if (!audio || !audioUrl) return;

        if (isPlaying) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    }, [isPlaying, audioUrl]);

    // Throttled time update to prevent excessive re-renders
    const handleListen = useCallback((e: Event) => {
        const now = Date.now();
        // Only update every 250ms
        if (now - lastTimeUpdate.current < 250) return;
        lastTimeUpdate.current = now;
        
        const audio = e.currentTarget as HTMLAudioElement;
        if (audio) setCurrentTime(audio.currentTime);
    }, [setCurrentTime]);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, [setIsPlaying]);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, [setIsPlaying]);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, [setIsPlaying, setCurrentTime]);

    const handleLoadedMetaData = useCallback((e: Event) => {
        const audio = e.currentTarget as HTMLAudioElement;
        if (audio) setDuration(audio.duration);
    }, [setDuration]);

    if (!currentSong || !audioUrl) return null;

    return (
        <div 
            className="fixed bottom-0 right-0 z-50 border-t border-border bg-background transition-[left] duration-200 ease-linear"
            style={{ left: sidebarWidth }}
        >
            <div className="mx-auto flex items-center gap-4 px-4 py-2">
                {/* Song info */}
                <div className="flex items-center gap-3 min-w-0 w-32 sm:w-48 shrink-0">
                    {currentSong.imageUrl && (
                        <img
                            src={currentSong.imageUrl}
                            alt={currentSong.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover shadow-md"
                        />
                    )}
                    <div className="min-w-0 hidden sm:block">
                        <p className="text-sm font-semibold truncate">
                            {currentSong.title}
                        </p>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="flex-1 min-w-0">
                    <AudioPlayer
                        ref={playerRef}
                        key={currentSong.id}
                        src={audioUrl}
                        autoPlayAfterSrcChange={true}
                        showSkipControls={false}
                        showJumpControls={false}
                        showDownloadProgress={true}
                        showFilledProgress={true}
                        customProgressBarSection={[
                            RHAP_UI.CURRENT_TIME,
                            RHAP_UI.PROGRESS_BAR,
                            RHAP_UI.DURATION,
                        ]}
                        customControlsSection={[
                            RHAP_UI.MAIN_CONTROLS,
                            RHAP_UI.VOLUME_CONTROLS,
                        ]}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onEnded={handleEnded}
                        onLoadedMetaData={handleLoadedMetaData}
                        onListen={handleListen}
                        listenInterval={250}
                        layout="horizontal"
                        className="melodia-player"
                    />
                </div>
            </div>

            <style jsx global>{`
                .melodia-player {
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                
                .melodia-player .rhap_container {
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                
                .melodia-player .rhap_main {
                    flex-direction: row !important;
                    gap: 0.5rem;
                }
                
                .melodia-player .rhap_controls-section {
                    flex: 0 0 auto !important;
                    margin: 0 !important;
                }
                
                .melodia-player .rhap_progress-section {
                    flex: 1 !important;
                    gap: 0.5rem;
                }
                
                .melodia-player .rhap_progress-bar {
                    background: hsl(var(--muted)) !important;
                    height: 4px !important;
                    border-radius: 2px !important;
                }
                
                .melodia-player .rhap_progress-filled {
                    background: #3b82f6 !important;
                    border-radius: 2px !important;
                }
                
                .melodia-player .rhap_progress-indicator {
                    background: #3b82f6 !important;
                    width: 12px !important;
                    height: 12px !important;
                    top: -4px !important;
                    box-shadow: 0 0 4px rgba(59, 130, 246, 0.4) !important;
                }
                
                .melodia-player .rhap_download-progress {
                    background: hsl(var(--muted-foreground) / 0.3) !important;
                    border-radius: 2px !important;
                }
                
                .melodia-player .rhap_time {
                    color: hsl(var(--muted-foreground)) !important;
                    font-size: 0.75rem !important;
                    min-width: 2.5rem;
                }
                
                .melodia-player .rhap_current-time {
                    text-align: right;
                }
                
                .melodia-player .rhap_button-clear {
                    color: hsl(var(--foreground)) !important;
                    transition: color 0.15s, transform 0.15s !important;
                }
                
                .melodia-player .rhap_button-clear:hover {
                    color: #3b82f6 !important;
                    transform: scale(1.1);
                }
                
                .melodia-player .rhap_main-controls-button {
                    width: 36px !important;
                    height: 36px !important;
                }
                
                .melodia-player .rhap_play-pause-button {
                    width: 40px !important;
                    height: 40px !important;
                }
                
                .melodia-player .rhap_play-pause-button svg {
                    width: 20px !important;
                    height: 20px !important;
                }
                
                .melodia-player .rhap_volume-controls {
                    flex: 0 0 auto !important;
                    justify-content: flex-end !important;
                }
                
                .melodia-player .rhap_volume-bar {
                    background: hsl(var(--muted)) !important;
                    height: 4px !important;
                    border-radius: 2px !important;
                }
                
                .melodia-player .rhap_volume-indicator {
                    background: #3b82f6 !important;
                    width: 10px !important;
                    height: 10px !important;
                    box-shadow: 0 0 4px rgba(59, 130, 246, 0.4) !important;
                }
                
                .melodia-player .rhap_volume-filled {
                    background: #3b82f6 !important;
                    border-radius: 2px !important;
                }
                
                /* Hide volume on mobile */
                @media (max-width: 640px) {
                    .melodia-player .rhap_volume-controls {
                        display: none !important;
                    }
                    .melodia-player .rhap_time {
                        min-width: 2rem;
                        font-size: 0.65rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Player;
