"use client";

import { SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
} from "~/components/ui/breadcrumb";
import {
    ToggleGroup,
    ToggleGroupItem
} from '~/components/ui/toggle-group';
import BreadcrumbClient from "~/components/sidebar/breadcrumb-client";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { queueSong } from "~/actions/generation";
import SongList from "~/components/layouts/song-list";
import { usePlayerStore } from "~/store/store";
const INSPIRATION_TAGS = [
    // ERAS
    "80s Retro",
    "90s Nostalgic",
    "2000s Pop",
    "Y2K",

    // GENRES
    "Pop",
    "Hip-Hop",
    "R&B",
    "EDM",
    "Rock",
    "Indie",
    "Lofi",
    "Cinematic",

    // MOODS
    "Happy",
    "Sad",
    "Energetic",
    "Calm",

    // PRODUCTION STYLE
    "Vintage",
    "Acoustic",
    "Electronic",
    "Atmospheric",
];


export default function DashboardContent() {
    const { currentSong} = usePlayerStore();

    const hasPlayer = !!currentSong


    const [triggerGroupValue, setTriggerGroupValue] = useState<"left" | "right">(
        "left"
    );
    const [IsInstrumental, setIsInstrumental] = useState<boolean | undefined>(false);
    const [description, setDescription] = useState<string>("");
    const [lyrics, setLyrics] = useState<string>("");

    const [avialableTags, setAvailableTags] = useState<string[]>(INSPIRATION_TAGS);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);


    const handleSelectTag = (tag: string) => {
        setAvailableTags((prev) => prev.filter((t) => t !== tag));
        setSelectedTags((prev) => [...prev, tag]);
    }

    const handleRemoveTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
        setAvailableTags((prev) => [...prev, tag]);
    }


    const handleSongGenerationButton = () => {
        console.log("Generating song with description:", description, "Instrumental:", IsInstrumental, "Lyrics:", lyrics);
        if (triggerGroupValue === 'left') {
            queueSong({
                prompt: description,
                instrumental: IsInstrumental,
            });
        } else {
            queueSong({
                prompt: description,
                instrumental: IsInstrumental,
                lyrics: lyrics,
            });
        }
    }

    return (
        <div className="flex h-screen flex-col w-full">
            <header className="bg-white/30 border-b px-4 z-10 py-2 sticky top-0 flex items-center justify-between">
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

            <main
                className={clsx(
                    "flex-1 p-4 sm:p-6 overflow-y-auto w-full",
                    currentSong ? "pb-48" : "pb-4"
                )}
            >
                <ToggleGroup
                    type="single"
                    defaultValue="left"
                    aria-label="Text alignment"
                    className="mb-4 bg-muted/50 rounded-md border w-full"
                    onValueChange={(value) => {
                        if (value === "left" || value === "right") setTriggerGroupValue(value);
                    }}
                >
                    <ToggleGroupItem
                        value="left"
                        aria-label="Left aligned"
                        className="flex-1 flex justify-center"
                    >
                        Single
                    </ToggleGroupItem>
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-9" />
                    <ToggleGroupItem
                        value="right"
                        aria-label="Right aligned"
                        className="flex-1 flex justify-center"
                    >
                        Custom
                    </ToggleGroupItem>
                </ToggleGroup>

                {
                    triggerGroupValue === 'left' ? (
                        <div className="w-full">
                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                    <h1 className="font-semibold text-lg sm:text-xl">Describe your song</h1>

                                    <div className="flex items-center w-full sm:w-auto gap-2">
                                        <span
                                            className="text-sm font-medium"
                                        >
                                            Make it Instrumental
                                        </span>
                                        <Switch checked={IsInstrumental} onCheckedChange={(checked) => setIsInstrumental(checked)} />
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Describe mood, tempo, instruments, lyrics, etc."
                                    className={
                                        clsx(
                                            "w-full min-h-30 sm:min-h-40 p-3 rounded-md border bg-muted/5 resize-vertical focus:outline-none focus:ring-2 focus:ring-primary",
                                        )
                                    }
                                    value={description}
                                    onChange={
                                        (e) => setDescription(e.target.value)
                                    }
                                />

                                <div className="mt-6">
                                    <div>
                                        {/* Selected Tags */}
                                        {selectedTags.length > 0 && (
                                            <>
                                                <h2 className="font-medium mb-2">Selected Tags</h2>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {selectedTags.map((tag) => (
                                                        <div
                                                            key={tag}
                                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full cursor-pointer hover:bg-primary/20"
                                                            onClick={() => handleRemoveTag(tag)} // FIXED ✔
                                                        >
                                                            {tag} &times;
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div>
                                        {/* Available Tags */}
                                        {avialableTags.length > 0 && (
                                            <>
                                                <h2 className="font-medium mb-2">Available Tags</h2>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {avialableTags.map((tag) => (
                                                        <div
                                                            key={tag}
                                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full cursor-pointer hover:bg-primary/20"
                                                            onClick={() => handleSelectTag(tag)} // FIXED ✔
                                                        >
                                                            {tag} <Plus className="inline-block w-4 h-4 ml-1" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>



                                <Button
                                    className="mt-4 w-full sm:w-auto"
                                    onClick={handleSongGenerationButton}
                                >
                                    Generate
                                </Button>

                                <SongList />

                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                    <h1 className="font-semibold text-lg sm:text-xl">Describe your song</h1>

                                    <div className="flex items-center w-full sm:w-auto gap-2">
                                        <span className="text-sm font-medium">
                                            Make it Instrumental
                                        </span>
                                        <Switch checked={IsInstrumental} onCheckedChange={(checked) => setIsInstrumental(checked)} />
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Describe mood, tempo, instruments, lyrics, etc."
                                    className={clsx(
                                        "w-full min-h-30 sm:min-h-40 p-3 rounded-md border bg-muted/5 resize-vertical focus:outline-none focus:ring-2 focus:ring-primary",
                                    )}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />

                                <div className="mt-6">
                                    <div>
                                        {/* Selected Tags */}
                                        {selectedTags.length > 0 && (
                                            <>
                                                <h2 className="font-medium mb-2">Selected Tags</h2>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {selectedTags.map((tag) => (
                                                        <div
                                                            key={tag}
                                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full cursor-pointer hover:bg-primary/20"
                                                            onClick={() => handleRemoveTag(tag)} // FIXED ✔
                                                        >
                                                            {tag} &times;
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div>
                                        {/* Available Tags */}
                                        {avialableTags.length > 0 && (
                                            <>
                                                <h2 className="font-medium mb-2">Available Tags</h2>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {avialableTags.map((tag) => (
                                                        <div
                                                            key={tag}
                                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full cursor-pointer hover:bg-primary/20"
                                                            onClick={() => handleSelectTag(tag)} // FIXED ✔
                                                        >
                                                            {tag} <Plus className="inline-block w-4 h-4 ml-1" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h1 className="font-semibold text-lg sm:text-xl mb-2">Lyrics</h1>
                                    <textarea
                                        placeholder="Enter your own lyrics here..."
                                        className={clsx(
                                            "w-full min-h-30 sm:min-h-40 p-3 rounded-md border bg-muted/5 resize-vertical focus:outline-none focus:ring-2 focus:ring-primary whitespace-pre-wrap",
                                            IsInstrumental && "opacity-50 cursor-not-allowed"
                                        )}
                                        value={lyrics}
                                        onChange={(e) => setLyrics(e.target.value)}
                                        disabled={IsInstrumental}
                                    />
                                </div>


                                <Button
                                    className="mt-4 w-full sm:w-auto"
                                    onClick={handleSongGenerationButton}
                                >Generate</Button>

                                <SongList />
                                
                                {hasPlayer && (
                                    <div className="mb-30">  
                                        <SongList />
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </main>
        </div>
    );
}
