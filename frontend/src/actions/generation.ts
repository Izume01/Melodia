"use server";

import { auth } from "~/lib/auth";
import { inngest } from "~/inngest/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
interface QueueSongParamsTypes {
    prompt: string;
    instrumental?: boolean
    lyrics?: string;
}

export async function queueSong(QueueSongParams: QueueSongParamsTypes) {

    // check the session
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/auth/sign-in");
    }

    const genereatedRequestId = randomUUID();

    const {
        prompt,
        instrumental = false,
        lyrics = "",
    } = QueueSongParams;


    await inngest.send({
        name : "generate-song-event", 
        data : {
            userId : session.user.id, 
            prompt,
            instrumental,
            requestId: genereatedRequestId,
            lyrics,
        }
    })
}