import { cookies } from "next/headers"
import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs"
import NewTweetForm from "./new-tweet-form";

export default function NewTweet({ user }: { user: User }) {
	const addTweet = async (formData: FormData) => {
		'use server';
		const title = String(formData.get('title'));
		const supabase = createServerActionClient<Database>({ cookies });
		await supabase.from('tweets').insert({ title, user_id: user.id });
	}

	return (
			<NewTweetForm 
				addTweet={addTweet} 
				avatarUrl={user.user_metadata.avatar_url} 
				name={user.user_metadata.name}
			/>
	)
}