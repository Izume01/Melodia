"use server";

import { db } from "~/server/db"
import { auth } from "~/lib/auth"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AccountId = process.env.R2_ACCOUNT_ID!;

const s3 = new S3Client({
    endpoint : `https://${AccountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
})

export default async function getSongList() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/sign-in");
    }

    const songs = await db.song.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    })

    const songsWithSignedUrls = await Promise.all(
        songs.map(async (song) => ({
            ...song,
            s3Key: song.s3Key ?
                await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket : process.env.R2_BUCKET_NAME!,
                        Key: song.s3Key,
                    })
                )
            : null,
            imageS3Key: song.imageS3Key ?
                await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket : process.env.R2_BUCKET_NAME!,
                        Key: song.imageS3Key,
                    })
                )
            : null,
        }))
    )


    return songsWithSignedUrls
}