import { NextResponse, type NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get('code');

	if (code) {
		const supabaseClient = createRouteHandlerClient({ cookies })
		await supabaseClient.auth.exchangeCodeForSession(code)
	}

	return NextResponse.redirect(requestUrl.origin)
}