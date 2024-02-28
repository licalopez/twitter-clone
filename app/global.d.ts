import { Database as DatabaseType } from "@/lib/database.types";

type Profile = DatabaseType['public']['Tables']['profiles']['Row'];
type Tweet = DatabaseType['public']['Tables']['tweets']['Row'];

declare global {
	type Database = DatabaseType;
	type TweetWithAuthor = Tweet & {
		author: Profile,
		likes_count: number,
		user_has_liked: boolean
	};
}