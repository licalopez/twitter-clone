import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation";
import GitHubButton from "./github-button";

export const dynamic = 'force-dynamic';

export default async function Login() {
	const supabase = createServerComponentClient<Database>({ cookies })
	const { data: { session }} = await supabase.auth.getSession();

	if (session)
		redirect('/')

	return (
		<div className="flex flex-1 items-center justify-center">
			<GitHubButton />
		</div>
	)
}
