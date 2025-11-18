import { step } from "inngest";
import { inngest } from "./client";

export const generateSong = inngest.createFunction(
    { id: "generate-song" },
    { event: "generate-song-event" },
    async ({ event, step }) => {
        
    }
)