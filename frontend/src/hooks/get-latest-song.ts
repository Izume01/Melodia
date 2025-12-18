    "use server";

import { db } from "~/server/db";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AccountId = process.env.R2_ACCOUNT_ID!;

const s3 = new S3Client({
    endpoint: `https://${AccountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
});

export interface PublishedSong {
    id: string;
    title: string;
    imageUrl: string | null;
    listenCount: number;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
}

export interface PaginatedSongsResult {
    songs: PublishedSong[];
    totalCount: number;
    hasMore: boolean;
}

export async function getLatestSongs(
    page: number = 1,
    limit: number = 12
): Promise<PaginatedSongsResult> {
    const skip = (page - 1) * limit;

    const [songs, totalCount] = await Promise.all([
        db.song.findMany({
            where: {
                published: true,
                s3Key: { not: null }
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                imageS3Key: true,
                listenCount: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            }
        }),
        db.song.count({
            where: {
                published: true,
                s3Key: { not: null }
            }
        })
    ]);

    const songsWithSignedUrls = await Promise.all(
        songs.map(async (song) => ({
            id: song.id,
            title: song.title,
            imageUrl: song.imageS3Key
                ? await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME!,
                        Key: song.imageS3Key,
                    }),
                    { expiresIn: 3600 }
                )
                : null,
            listenCount: song.listenCount,
            createdAt: song.createdAt,
            user: song.user,
        }))
    );

    return {
        songs: songsWithSignedUrls,
        totalCount,
        hasMore: skip + songs.length < totalCount,
    };
}

// Keep backward compatibility
export default async function getLatestSong() {
    const result = await getLatestSongs(1, 1);
    return result.songs[0] ?? null;
}

