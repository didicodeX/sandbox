import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/auth/signin");
  }
  return (
    <div className="text-wrap">
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
