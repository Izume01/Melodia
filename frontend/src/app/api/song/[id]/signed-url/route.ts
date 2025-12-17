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

    // check if the song check exist and belongs to the user
    const song = await db.song.findFirst({
        where : {
            id : params.id,
            userId : session.user.id
        }
    })

    if (!song) {
        return NextResponse.json(
            { error : "Song not found" },
            { status: 404 }
        )
    }
    if (song.s3Key === null) {
        return NextResponse.json(
            { error : "Not found " },
            { status: 404 }
        )
    }

    // we now have a valid song that belongs to the user


    const songUrl = await getSignedUrl(
        s3, 
        new GetObjectCommand({
            Bucket : process.env.R2_BUCKET_NAME!,
            Key : song.s3Key
        })
    )

    return NextResponse.json(
        { url : songUrl }
    )
}