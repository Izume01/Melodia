"use server";

import { db } from "~/server/db"
import { auth } from "~/lib/auth"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AccountId = process.env.R2_ACCOUNT_ID!;

const s3 = new S3Client({
    endpoint: `https://${AccountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
})

/**
 * --------------------------------
 * @description IMPORTANT : LOGICAL ISSUE HERE
 * 
 * @todo The signed URLs generated here will expire after a short period (default is 15 minutes).
 * This means that if the user tries to access their songs after the URLs have expired,
 * they will encounter broken links. A more robust solution would involve generating
 * signed URLs on-the-fly when the user requests to play or download a song, rather than
 * storing them in the database or returning them directly from this function.
 * 
 * @summary Create a seperate api route that will take the song ID as a parameter,
 * then the route will verify the user's access to the song and generate a signed URL for a short period.
 * This way, the user can always get a valid URL when they need to access their songs.
 * 
 * 
 * --------------------------------
 */

export default async function getSongList() {
    "use server";
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/auth/sign-in");


    const songs = await db.song.findMany({
        where: {
            userId: session.user.id
        },

        orderBy: {
            createdAt: "desc"
        },

        select: {
            id: true,
            title: true,
            prompt: true,
            imageS3Key: true,
            s3Key: false,
            createdAt: true,
            listenCount: true,
            published: true,
        }
    })

    const songsWithSignedUrls = await Promise.all(
        songs.map(async (song) => ({
            ...song,
            imageS3Key: song.imageS3Key ?
                await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME!,
                        Key: song.imageS3Key,
                    })
                )
                : null,
        }))
    )

    return songsWithSignedUrls;
}

// export default async function getSongList() {
//     "use server";
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });

//     if (!session) {
//         redirect("/auth/sign-in");
//     }

//     const songs = await db.song.findMany({
//         where: { userId: session.user.id },
//         orderBy: { createdAt: "desc" },
//     })

//     const songsWithSignedUrls = await Promise.all(
//         songs.map(async (song) => ({
//             ...song,
//             s3Key: song.s3Key ?
//                 await getSignedUrl(
//                     s3,
//                     new GetObjectCommand({
//                         Bucket: process.env.R2_BUCKET_NAME!,
//                         Key: song.s3Key,
//                     })
//                 )
//                 : null,
//             imageS3Key: song.imageS3Key ?
//                 await getSignedUrl(
//                     s3,
//                     new GetObjectCommand({
//                         Bucket: process.env.R2_BUCKET_NAME!,
//                         Key: song.imageS3Key,
//                     })
//                 )
//                 : null,
//         }))
//     )


//     return songsWithSignedUrls
// }