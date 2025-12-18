"use client";

import React, { useEffect } from 'react';
import { usePlayerStore } from '~/store/store';
import { Button } from '~/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '~/components/ui/slider';

const Player = () => {
    const { currentSong, isPlaying, duration, currentTime, play, pause, seek } = usePlayerStore();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.code === 'Space') {
                e.preventDefault();
                if (currentSong) {
                    if (isPlaying) {
                        pause();
                    } else {
                        play(currentSong);
                    }
                }
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                seek(Math.max(0, currentTime - 5));
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                seek(Math.min(duration, currentTime + 5));
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentSong, isPlaying, currentTime, duration, play, pause, seek]);

    if (!currentSong) return null;

    const formatTime = (seconds: number) => {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (value: number[]) => {
        if (value[0] !== undefined) {
            seek(value[0]);
        }
    };

    return (
        <div className="fixed bottom-0 right-0 z-30 bg-gradient-to-t from-background via-background to-background/80 border-t border-border/40 backdrop-blur-sm" 
             style={{ left: "var(--sidebar-width, 0)" }}>
            <div className="w-full max-w-full px-4 py-4">
                <div className="flex items-center gap-4">
                    {/* Album Art & Song Info */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                        {currentSong.imageUrl && (
                            <img 
                                src={currentSong.imageUrl} 
                                alt={currentSong.title} 
                                className="w-14 h-14 rounded-md object-cover" 
                            />
                        )}
                        <div className="flex flex-col">
                            <h3 className="text-sm font-semibold line-clamp-1">{currentSong.title}</h3>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="default" 
                                size="icon" 
                                className="h-10 w-10 rounded-full"
                                onClick={isPlaying ? pause : () => play(currentSong)}
                            >
                                {isPlaying ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Play className="h-5 w-5 ml-0.5" />
                                )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <SkipForward className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 w-full max-w-md">
                            <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                                {formatTime(currentTime)}
                            </span>
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={1}
                                onValueChange={handleSeek}
                                className="flex-1"
                            />
                            <span className="text-xs text-muted-foreground min-w-[40px]">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Right side - Volume, etc */}
                    <div className="min-w-[200px]"></div>
                </div>
            </div>
        </div>
    );
};

export default Player;