"use client"

import React from 'react'
import { authClient } from '~/lib/auth-client';

const UpgradeButton = () => {
    const upgrade = async () => {
        await authClient.checkout({
            products: [
                "e85b4e3c-892b-42bf-a86a-48298c8dbcd1",
                "b7874302-76e9-4421-8edb-b4df4eacdf83",
                "fb501809-6e68-413c-991c-c889f52f8294"
            ]

        })
    }
    return (
        <button
            className="ml-4 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => upgrade()}
        >
            Upgrade
        </button>
    )
}

export default UpgradeButton