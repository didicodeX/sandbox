import { auth } from "./auth";
import { headers } from "next/headers";
import { getLimitation } from "./auth-limitation";
import { UserPlan } from "@/generated/prisma/client";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return {
    ...session,
    limitations: getLimitation(session?.user.plan as UserPlan),
  };
};