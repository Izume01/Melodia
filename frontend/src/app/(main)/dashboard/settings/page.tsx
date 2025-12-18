import { AccountView } from "@daveyplate/better-auth-ui"
export default function CustomAccountPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="mb-6 text-2xl font-semibold">
                Account Settings
            </h1>
            <AccountView  />
            
        </div>
    )
}