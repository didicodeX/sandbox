import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function Auth() {
  const session = await getSession();
  const user = session?.user;
  if (user) {
    redirect("/");
  }
  return <div>{JSON.stringify(user)}</div>;
}
