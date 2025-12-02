"use client";

import { LayoutDashboard, Music } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function SidebarMenuClient() {
    const path = usePathname();

    let items = [
        {
            title: "Dashboard",
            href: "/",
            icon: LayoutDashboard,
            active: false
        },
        {
            title: "Create Song",
            href: "/create",
            icon: Music,
            active: false
        }
    ]

    items = items.map((item) => ({
        ...item,
        active: item.href === path
    }))


    return (
        <>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.active}>
                        <a href={item.href}>
                            <item.icon />
                            <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    )
}