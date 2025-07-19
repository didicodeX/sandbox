import { Button } from "./ui/button";
import Link from "next/link";
import { getSession } from "@/lib/auth-session";
import Logout from "./logout";

export default async function Header() {
  const session = await getSession();
  const user = session?.user;
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Prisma / Auth app</h1>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Logout />
          ) : (
            <>
              <Button variant="outline"><Link href="/auth/signin">Sign in</Link></Button>
              <Button variant="default"><Link href="/auth/signup">Sign up</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}