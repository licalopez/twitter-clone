'use client'
import { useEffect, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import Image from "next/image";

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
		<div key={tweet.id} className="bg-main border border-border flex px-4 py-8 rounded-lg">
			<div id="user-avatar" className="h-12 w-12">
				<Image 
					alt={`${tweet.author.name}'s avatar`} 
					src={tweet.author.avatar_url} 
					className="rounded-full" 
					height={40}
					width={40}
				/>
			</div>
			<div id="user-tweet" className="ml-4">
				<p>
					<span className="font-bold text-light">{tweet.author.name}</span>
					<span className="ml-2 text-gray-400 text-sm">@{tweet?.author?.username}</span>
				</p>
				<p className="my-1 text-light">{tweet.title}</p>
				<Likes addOptimisticTweet={addOptimisticTweet} tweet={tweet} />
			</div>
		</div>
	))
}
