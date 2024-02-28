import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/auth-button-server";
import Likes from "./likes";
import NewTweet from "./new-tweet";
import Tweets from "./tweets";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { session }} = await supabase.auth.getSession();

  if (!session)
    redirect('/login');
  
  const { data } = await supabase
    .from('tweets')
    .select('*, author: profiles(*), likes(user_id)')
    .order('created_at', { ascending: false });

  const tweets = data?.map(tweet => ({
    ...tweet,
    author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
    likes_count: tweet.likes.length,
    user_has_liked: !!tweet.likes.find(like => like.user_id === session.user.id)
  })) ?? []

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      <Tweets tweets={tweets} />
    </>
  );
}
