"use client"
import { UserButton } from "@daveyplate/better-auth-ui";

export default  function SidebarFooterClient() {

    return (
        <div className="w-full">
            <h1 className="mb-2  text-sm text-muted-foreground">
                Signed in as:
            </h1>
            <UserButton  size="lg"  variant={"outline"}/>
        </div>
    )
}