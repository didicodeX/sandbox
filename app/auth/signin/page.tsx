"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return;
    }

    signIn.email( 
      {
        email,
        password,
        callbackURL: "/auth",
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          router.push("/auth");
        },
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            toast.error("Please verify your email address");
          }
          toast.error(ctx.error.message);
        },
      }
    );

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sm:text-center">Sign in</CardTitle>
        <CardDescription className="sm:text-center">
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="*:not-first:mt-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="hi@yourcompany.com"
              type="email"
              required
              name="email"
            />
          </div>
          <div className="*:not-first:mt-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              required
              name="password"
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
        <span className="text-muted-foreground text-xs">Or</span>
      </div>

      <Button variant="outline" onClick={() => signIn.social({
        provider: "google",
      })}>
        Continue with Google
      </Button>
      <p className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          className="underline hover:no-underline text-blue-500"
          href="/auth/signup"
        >
          Sign up
        </Link>
      </p>
      <p className="text-center text-sm">
        Forgot your password?{" "}
        <Link
          className="underline hover:no-underline text-blue-500"
          href="/auth/forgot-password"
        >
          Reset password
        </Link>
      </p>
      <p className="text-muted-foreground text-center text-xs">
        By signing in you agree to our{" "}
        <a className="underline hover:no-underline" href="#">
          Terms
        </a>
        .
      </p>
    </Card>
  );
}
