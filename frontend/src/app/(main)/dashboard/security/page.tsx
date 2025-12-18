"use client"

import { SecuritySettingsCards } from "@daveyplate/better-auth-ui"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation";

export default function CustomAccountPage() {

    const router = useRouter();

    return (
        <div className="container mx-auto py-12 px-4">
            
            <Button 
                variant="outline" 
                className="mb-6"
                onClick={() => router.push("/dashboard/settings")}
            >

                Back to Settings
            </Button>
            <SecuritySettingsCards />
        </div>
    )
}