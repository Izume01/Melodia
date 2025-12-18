import {betterAuth} from "better-auth";
import type { BetterAuthPlugin } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
    accessToken : process.env.POLAR_ACCESS_TOKEN!
})

export const auth = betterAuth({
    database : prismaAdapter(db , {
        provider : "postgresql"
    }),
    emailAndPassword : {
        enabled : true,
    },

    plugins : [
        // Casting required due to versioned type differences between
        // `better-auth` and `@polar-sh/better-auth` plugin typings.
        // The runtime contract is compatible.
        (polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "e85b4e3c-892b-42bf-a86a-48298c8dbcd1",
                            slug: "Large-Credit-Pack" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Large-Credit-Pack
                        },
                        {
                            productId: "b7874302-76e9-4421-8edb-b4df4eacdf83",
                            slug: "Medium-Credit-Pack" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Medium-Credit-Pack
                        },
                        {
                            productId: "fb501809-6e68-413c-991c-c889f52f8294",
                            slug: "Small-Credit-Pack" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Small-Credit-Pack
                        }
                    ],
                    successUrl: "/",
                    authenticatedUsersOnly: true
                }),
                portal(),
                webhooks({
                    secret : process.env.POLAR_WEBHOOK_SECRET!, 
                    onOrderPaid : async (order) => {
                        const externalUserId = order.data.customer.externalId

                        if (!externalUserId) {
                            console.warn("Order paid webhook received for customer without external ID. Cannot credit user.")
                            return
                        }

                        const productId = order.data.productId

                        let creditsToAdd = 0

                        switch (productId) {
                            case "e85b4e3c-892b-42bf-a86a-48298c8dbcd1": // Large Credit Pack
                                creditsToAdd = 100
                                break
                            case "b7874302-76e9-4421-8edb-b4df4eacdf83": // Medium Credit Pack
                                creditsToAdd = 50
                                break
                            case "fb501809-6e68-413c-991c-c889f52f8294": // Small Credit Pack
                                creditsToAdd = 20
                                break
                            default:
                                console.warn(`Unknown product ID ${productId} in order paid webhook.`)
                                return
                        }

                        await db.user.update({
                            where : {
                                id : externalUserId
                            },
                            data : {
                                credits : {
                                    increment : creditsToAdd
                                }
                            }
                        })
                    }
                })
            ],
        }) as unknown as BetterAuthPlugin)
    ]
})