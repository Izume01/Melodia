import { revalidatePath } from "next/cache";
import { inngest } from "./client";
import { db } from "~/server/db";

export const generateSong = inngest.createFunction(
  { id: "generate-song" },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    const { userId, prompt, instrumental, requestId, lyrics: inputLyrics } = event.data as {
      userId: string;
      prompt: string;
      instrumental: boolean;
      requestId: string;
      lyrics?: string;
    };

    // 1. GENERATE AUDIO + IMAGE + LYRICS
    const result = await step.run("generate-song", async () => {
      const url = process.env.MUSIC_GENERATION_URL;
      if (!url) throw new Error("MUSIC_GENERATION_URL not set");

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: prompt,
          instrumental,
          lyrics: inputLyrics || "",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate song");
      }

      return await res.json();
    });

    const {
      s3_audio,
      s3_image,
      lyrics,
      categories,
      prompt: generatedPrompt,
    } = result as {
      s3_audio: string;
      s3_image: string;
      lyrics: string;
      categories?: string | string[];
      prompt: string;
    };

    const normalizedCategories = (() => {
      if (Array.isArray(categories)) {
        return categories.map((name) => name?.trim()).filter((name): name is string => Boolean(name));
      }

      if (typeof categories === "string") {
        return categories
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean);
      }

      return [] as string[];
    })();

    const categoryNames = normalizedCategories.length > 0 ? normalizedCategories : ["Uncategorized"];

    // 2. SAVE SONG + DECREMENT CREDITS ATOMICALLY + IDEMPOTENCY
    const song = await step.run("save-song", async () => {
      return await db.$transaction(async (tx) => {
        // IDEMPOTENCY CHECK — prevent duplicates on retry
        const existing = await tx.song.findUnique({
          where: { requestId },
        });
        if (existing) return existing;

        // CHECK CREDITS
        const user = await tx.user.findFirstOrThrow({
          where: { id: userId },
          select: { credits: true },
        });

        if (user.credits <= 0) {
          throw new Error("Insufficient credits");
        }

        // DECREMENT CREDITS
        await tx.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
        });

        // CREATE SONG RECORD
        return tx.song.create({
          data: {
            requestId,
            title: generatedPrompt,
            s3Key: s3_audio,
            imageS3Key: s3_image,
            lyrics,
            instrumental,
            published: false,
            listenCount: 0,
            categories: {
              connectOrCreate: categoryNames.map((name) => ({
                where: { name },
                create: { name },
              })),
            },
            user: { connect: { id: userId } },
          },
        });
      });
    });

    await step.run("revalidate-cache" , async () => {
      revalidatePath('/create')
    })

    return {
      success: true,
      songId: song.id,
    };
  }
);
