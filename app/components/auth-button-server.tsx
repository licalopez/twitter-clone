import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AuthButtonClient from "./auth-button-client";

export default async function AuthButtonServer() {
	const supabase = createServerComponentClient({ cookies });
	const { data: { session } } = await supabase.auth.getSession();
	
	return (
		<AuthButtonClient session={session} />
	)
}
