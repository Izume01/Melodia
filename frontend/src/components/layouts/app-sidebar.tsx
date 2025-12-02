import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu
} from "../ui/sidebar";
import { headers } from "next/headers";
import SidebarMenuClient from "../sidebar/sidebar-menu-client";
import SidebarFooterClient from "../sidebar/sidebar-footer-client";
import { getCredits } from "~/hooks/get-credits";


export default async function AppSidebar() {

    const credits = await getCredits(await headers());
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>

                <SidebarGroup>
                    <SidebarGroupLabel className="mb-8">
                        <div className="flex flex-col gap-0">
                            <h1 className="text-2xl font-bold tracking-tight">Music</h1>
                            <h2 className="text-sm text-muted-foreground">Generator</h2>
                        </div>
                    </SidebarGroupLabel>


                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuClient />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto border-t w-full" >
                <div className="mb-2 w-full flex items-center justify-center">
                    <div className="flex items-center gap-3 px-3 py-2 bg-muted/10 dark:bg-muted/20 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v1.5h-2v-1.5A3.5 3.5 0 018.5 13H7v-2h1.5A3.5 3.5 0 0111 7.5V6h2v1.5A3.5 3.5 0 0115.5 11H17v2h-1.5A3.5 3.5 0 0113 16.5z"/>
                        </svg>

                        <div className="text-sm text-center">
                            {credits !== null ? (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-semibold">{credits}</span>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">credits</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 12a9 9 0 11-6-8.48" />
                                    </svg>
                                    <span>Loading credits…</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <SidebarFooterClient />
            </SidebarFooter>
        </Sidebar>
    )
}