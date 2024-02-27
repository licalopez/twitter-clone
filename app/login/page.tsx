import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation";
import AuthButtonClient from "../components/auth-button-client";

export default async function Login() {
	const supabase = createServerComponentClient({ cookies })
	const { data: { session }} = await supabase.auth.getSession();

	if (session)
		redirect('/')

	return (
		<AuthButtonClient session={session} />
	)
}