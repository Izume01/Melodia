import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function getCredits(headers: Headers) {
    const session = await auth.api.getSession({ headers });
    if (!session) return null;

    const user = await db.user.findFirstOrThrow({
        where: { id: session.user.id },
        select: { credits: true },
    });

    return user.credits;
}