import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import AppSidebar from "~/components/layouts/app-sidebar";
import { SidebarInset } from "~/components/ui/sidebar";
import DashboardContent from "../_components/dashboard-content";
export default async function HomePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/sign-in");
    }

    return (
        <>
            <AppSidebar />
            <SidebarInset className="flex h-screen flex-col">
                <DashboardContent />
            </SidebarInset>
        </>
    );
}
