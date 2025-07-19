"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Logout() {
  const router = useRouter();
  const handleLogout = () => {
    signOut();
    router.push("/auth/signin");
    router.refresh();
  };
  return <Button onClick={handleLogout}>Logout</Button>;
}