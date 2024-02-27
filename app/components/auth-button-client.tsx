'use client'
import { type Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient({ session }: { session: Session | null }) {
	const router = useRouter();
	const supabase = createClientComponentClient();
 
	const handleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: 'http://localhost:3000/auth/callback'
			}
		});
	}

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.refresh();
	}

	return session ? (
		<button onClick={handleLogout }>
			Logout
		</button>
	) : (
		<button onClick={handleLogin}>
			Login
		</button>
	)
}
