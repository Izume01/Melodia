"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
} from "~/components/ui/breadcrumb";
import BreadcrumbClient from "~/components/sidebar/breadcrumb-client";
import { getPopularSongs, type PublishedSong } from "~/hooks/get-popular-song";
import { getLatestSongs } from "~/hooks/get-latest-song";
import { usePlayerStore } from "~/store/store";
import { Button } from "~/components/ui/button";
import { Play, Pause, Music2, TrendingUp, Clock, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";

interface SongSectionProps {
    title: string;
    icon: React.ReactNode;
    songs: PublishedSong[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    loadingMore: boolean;
}

function SongCard({ song }: { song: PublishedSong }) {
    const { currentSong, isPlaying, play, pause } = usePlayerStore();
    const isCurrentSong = currentSong?.id === song.id;
    const isCurrentlyPlaying = isCurrentSong && isPlaying;

    const handlePlay = async () => {
        if (isCurrentlyPlaying) {
            pause();
        } else {
            await play({
                id: song.id,
                title: song.title,
                imageUrl: song.imageUrl,
            });
        }
    };

    return (
        <div
            className={cn(
                "group relative rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg",
                isCurrentlyPlaying && "border-primary/50 shadow-primary/10"
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
                {song.imageUrl ? (
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Music2 className="w-12 h-12 text-gray-400" />
                    </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                        size="icon"
                        className={cn(
                            "h-14 w-14 rounded-full shadow-xl transition-all duration-300 scale-90 group-hover:scale-100",
                            isCurrentlyPlaying
                                ? "bg-primary hover:bg-primary/90 text-white"
                                : "bg-white hover:bg-gray-100 text-black"
                        )}
                        onClick={handlePlay}
                    >
                        {isCurrentlyPlaying ? (
                            <Pause className="h-6 w-6" />
                        ) : (
                            <Play className="h-6 w-6 ml-1" />
                        )}
                    </Button>
                </div>

                {/* Now Playing Indicator */}
                {isCurrentlyPlaying && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                        <span className="flex gap-0.5">
                            <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className={cn(
                    "font-semibold text-sm truncate mb-1",
                    isCurrentlyPlaying ? "text-primary" : "text-gray-900"
                )}>
                    {song.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                    {song.user?.name || "Unknown Artist"}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {song.listenCount.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}

function SongSection({ title, icon, songs, loading, hasMore, onLoadMore, loadingMore }: SongSectionProps) {
    if (loading) {
        return (
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gray-100">
                        {icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (songs.length === 0) {
        return null;
    }

    return (
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gray-100">
                    {icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {songs.map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-6">
                    <Button
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

const MainContent = () => {
    const [popularSongs, setPopularSongs] = useState<PublishedSong[]>([]);
    const [latestSongs, setLatestSongs] = useState<PublishedSong[]>([]);
    const [popularLoading, setPopularLoading] = useState(true);
    const [latestLoading, setLatestLoading] = useState(true);
    const [popularPage, setPopularPage] = useState(1);
    const [latestPage, setLatestPage] = useState(1);
    const [popularHasMore, setPopularHasMore] = useState(false);
    const [latestHasMore, setLatestHasMore] = useState(false);
    const [popularLoadingMore, setPopularLoadingMore] = useState(false);
    const [latestLoadingMore, setLatestLoadingMore] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [popularResult, latestResult] = await Promise.all([
                    getPopularSongs(1, 12),
                    getLatestSongs(1, 12),
                ]);

                setPopularSongs(popularResult.songs);
                setPopularHasMore(popularResult.hasMore);
                setLatestSongs(latestResult.songs);
                setLatestHasMore(latestResult.hasMore);
            } catch (error) {
                console.error("Error fetching songs:", error);
            } finally {
                setPopularLoading(false);
                setLatestLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const loadMorePopular = useCallback(async () => {
        setPopularLoadingMore(true);
        try {
            const nextPage = popularPage + 1;
            const result = await getPopularSongs(nextPage, 12);
            setPopularSongs((prev) => [...prev, ...result.songs]);
            setPopularHasMore(result.hasMore);
            setPopularPage(nextPage);
        } catch (error) {
            console.error("Error loading more popular songs:", error);
        } finally {
            setPopularLoadingMore(false);
        }
    }, [popularPage]);

    const loadMoreLatest = useCallback(async () => {
        setLatestLoadingMore(true);
        try {
            const nextPage = latestPage + 1;
            const result = await getLatestSongs(nextPage, 12);
            setLatestSongs((prev) => [...prev, ...result.songs]);
            setLatestHasMore(result.hasMore);
            setLatestPage(nextPage);
        } catch (error) {
            console.error("Error loading more latest songs:", error);
        } finally {
            setLatestLoadingMore(false);
        }
    }, [latestPage]);

    return (
        <div className="flex h-screen flex-col w-full">
            <header className="bg-white/80 backdrop-blur-md border-b px-4 z-10 py-2 sticky top-0 flex items-center justify-between">
                <div className="flex shrink-0 grow items-center gap-2">
                    <SidebarTrigger />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-6"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbClient />
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <ScrollArea className="flex-1">
                <main className="p-6 pb-32">
                    {/* Hero Section */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Discover Music
                        </h1>
                        <p className="text-muted-foreground">
                            Explore AI-generated tracks from the community
                        </p>
                    </div>

                    {/* Popular Songs */}
                    <SongSection
                        title="Popular Songs"
                        icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
                        songs={popularSongs}
                        loading={popularLoading}
                        hasMore={popularHasMore}
                        onLoadMore={loadMorePopular}
                        loadingMore={popularLoadingMore}
                    />

                    {/* Latest Songs */}
                    <SongSection
                        title="Latest Releases"
                        icon={<Clock className="w-5 h-5 text-blue-500" />}
                        songs={latestSongs}
                        loading={latestLoading}
                        hasMore={latestHasMore}
                        onLoadMore={loadMoreLatest}
                        loadingMore={latestLoadingMore}
                    />

                    {/* Empty State */}
                    {!popularLoading && !latestLoading && popularSongs.length === 0 && latestSongs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="p-6 rounded-full bg-gray-100 mb-6">
                                <Music2 className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No published songs yet
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                Be the first to create and publish a song! Head over to the create page to generate your AI music.
                            </p>
                        </div>
                    )}
                </main>
            </ScrollArea>
        </div>
    );
};

export default MainContent;
