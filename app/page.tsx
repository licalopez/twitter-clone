import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/auth-button-server";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session }} = await supabase.auth.getSession();

  if (!session)
    redirect('/login');
  
  const { data: tweets } = await supabase.from('tweets').select();

  return (
    <>
      <AuthButtonServer />
      <pre>
        {JSON.stringify(tweets, null, 2)}
      </pre>
    </>
  );
}
