'use client'
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function GitHubButton() {
	const supabase = createClientComponentClient<Database>()

	const handleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: 'http://localhost:3000/auth/callback'
			}
		});
	}
	
	return (
		<button onClick={handleLogin} className="flex flex-col items-center p-8 rounded-xl hover:bg-main">
			<Image src="/github-mark-white.png" alt="GitHub logo" height={100} width={100} />
			<span className="mt-5">
				Sign in with GitHub
			</span>
		</button>
	)
}
