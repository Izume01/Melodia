import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { auth } from "~/lib/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'


const AccountId = process.env.R2_ACCOUNT_ID!;

const s3 = new S3Client({
    endpoint: `https://${AccountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
})

export async function GET(req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return NextResponse.json(
            {
                error: "Unauthorized"
            },
            {
                status: 401
            });
    }

    // First, try to find a song that either:
    // 1. Belongs to the current user, OR
    // 2. Is published (publicly available)
    const song = await db.song.findFirst({
        where: {
            id: params.id,
            OR: [
                { userId: session.user.id },
                { published: true }
            ]
        }
    })

    if (!song) {
        return NextResponse.json(
            { error: "Song not found" },
            { status: 404 }
        )
    }
    
    if (song.s3Key === null) {
        return NextResponse.json(
            { error: "Song audio not available" },
            { status: 404 }
        )
    }

    // Increment listen count for songs that don't belong to the user
    if (song.userId !== session.user.id) {
        await db.song.update({
            where: { id: song.id },
            data: { listenCount: { increment: 1 } }
        })
    }

    // we now have a valid song that the user can access
    const songUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: song.s3Key
        }),
        { expiresIn: 3600 } // 1 hour expiration
    )

    return NextResponse.json(
        { url: songUrl }
    )
}
