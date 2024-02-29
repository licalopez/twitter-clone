'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation";

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
		<form action={handleLikes} className="mt-2">
			<button type="submit" className="flex group items-center">
				<svg
					className={`group-hover:fill-red-500 group-hover:stroke-red-500 ${
						tweet.user_has_liked
							? 'fill-red-500 stroke-red-500'
							: 'fill-none stroke-gray-500'
					}`}
					height="16"
					width="16"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
				</svg>
				<span className={`group-hover:text-red-500 ml-2 text-sm ${tweet.user_has_liked ? 'text-red-500' : 'text-gray-500'}`}>
					{tweet.likes_count}
				</span>
			</button>
		</form>
	)
}
