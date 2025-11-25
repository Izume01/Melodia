import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import AppSidebar from "~/components/layouts/app-sidebar";
import { SidebarInset } from "~/components/ui/sidebar";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";

export default async function HomePage() {

	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) {
		redirect('/auth/sign-in')
	}

	return (
		<>
			<AppSidebar />
			<SidebarInset className="flex h-screen flex-col">
				<header className="bg-white/30 border-b p-4 flex items-center justify-between">
					<SidebarTrigger />
					<Separator />
				</header>

				<main className="flex-1 p-6 overflow-y-auto">
					<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
					<p>Welcome to the dashboard!</p>
				</main>
			</SidebarInset>
		</>
	);
}
