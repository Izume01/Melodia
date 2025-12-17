"use client";

import { useEffect, useState, useRef } from "react";
import getSongList from "~/hooks/getSongList";
import { usePlayerStore } from "~/store/store";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Play, Pause, Calendar } from "lucide-react";
import { cn } from "~/lib/utils";

type Song = {
    id: string;
    title: string;
    prompt: string | null;
    imageS3Key: string | null;
    createdAt: Date | string;
};

export default function SongList() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    
    const { currentSong, isPlaying, play, pause } = usePlayerStore();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const fetchedSongs = await getSongList();
                setSongs(fetchedSongs);
            } catch (error) {
                console.error("Error fetching songs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const togglePlay = async (song: Song) => {
        if (currentSong?.id === song.id && isPlaying) {
            pause();
        } else {
            await play({
                id: song.id,
                title: song.title || "Untitled Track",
                imageUrl: song.imageS3Key
            });
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading songs...</div>;
    }

    return (
        <div className="w-full mt-8">
            <div className="mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Your Songs</h2>
                <p className="text-muted-foreground">List of your generated tracks.</p>
            </div>
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">#</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Date Added</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {songs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No songs generated yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            songs.map((song, index) => (
                                <TableRow key={song.id} className="group hover:bg-muted/50">
                                    <TableCell className="font-medium relative text-center w-[50px]">
                                        <span className={cn("group-hover:hidden", currentSong?.id === song.id && isPlaying && "text-primary")}>
                                            {currentSong?.id === song.id && isPlaying ? (
                                                <span>
                                                    <Pause className="inline-block h-4 w-4 " />
                                                </span>
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hidden group-hover:inline-flex h-8 w-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            onClick={() => togglePlay(song)}
                                        >
                                            {currentSong?.id === song.id && isPlaying ? (
                                                <Pause className="h-4 w-4" />
                                            ) : (
                                                <Play className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {song.imageS3Key && (
                                                <div className="relative h-10 w-10 overflow-hidden rounded bg-muted">
                                                    <img
                                                        src={song.imageS3Key}
                                                        alt={song.title || "Song cover"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className={cn("font-medium leading-none", currentSong?.id === song.id && isPlaying && "text-primary")}>
                                                    {song.title || "Untitled Track"}
                                                </span>
                                                <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px] mt-1">
                                                    {song.prompt}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(song.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}