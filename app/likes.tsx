'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface LikesProps {
	addOptimisticTweet: (newTweet: TweetWithAuthor) => void, 
	tweet: TweetWithAuthor
}

export default function Likes({ addOptimisticTweet, tweet }: LikesProps) {
	const router = useRouter();

	const handleLikes = async () => {
		const supabase = createClientComponentClient<Database>();
		const { data: { user }} = await supabase.auth.getUser();
		if (user) {
			if (tweet.user_has_liked) {
				addOptimisticTweet({
					...tweet,
					likes_count: tweet.likes_count - 1,
					user_has_liked: !tweet.user_has_liked
				})
				await supabase.from('likes').delete().match({ tweet_id: tweet.id, user_id: user.id })
			} else {
				addOptimisticTweet({
					...tweet,
					likes_count: tweet.likes_count + 1,
					user_has_liked: !tweet.user_has_liked
				})
				await supabase.from('likes').insert({ tweet_id: tweet.id, user_id: user.id });
			}
			router.refresh();
		}
	}

	return (
		<form action={handleLikes}>
			<button type="submit">
				{tweet.likes_count} Likes
			</button>
		</form>
	)
}
