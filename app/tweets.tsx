'use client'
import { useEffect, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
	const router = useRouter();
	const supabase = createClientComponentClient<Database>();
	
	const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
		tweets, 
		(currentOptimisticTweets, newTweet) => {
			const newOptimisticTweets = [...currentOptimisticTweets];
			const index = newOptimisticTweets.findIndex(tweet => tweet.id === newTweet.id);
			newOptimisticTweets[index] = newTweet;
			
			return newOptimisticTweets;
		}
	);

	useEffect(() => {
		const channel = supabase.channel('realtime tweets')
			.on('postgres_changes', {
				event: '*',
				schema: 'public',
				table: 'tweets'
			}, payload => {
				router.refresh();
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		}
	}, [router, supabase]);

	return optimisticTweets.map(tweet => (
		<div key={tweet.id} className="my-3">
			<p>{tweet.author.name} {tweet?.author?.username}</p>
			<p>{tweet.title}</p>
			<Likes addOptimisticTweet={addOptimisticTweet} tweet={tweet} />
		</div>
	))
}
