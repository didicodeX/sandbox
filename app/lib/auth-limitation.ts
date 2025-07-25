import { UserPlan } from "@/generated/prisma/client"

type LimitationType = {
  files: number,
  canAddPassword: boolean,
  canAddPricing: boolean
}

const PLAN_LIMITATIONS: Record<UserPlan, LimitationType> = {
  FREE: {
    files: 1,
    canAddPassword: false,
    canAddPricing: false
  },
  BASIC: {
    files: 10,
    canAddPassword: true,
    canAddPricing: true
  },
  PRO: {
    files: 100,
    canAddPassword: true,
    canAddPricing: true
  }
}

export const getLimitation = (plan: UserPlan) => {
  const limitation = PLAN_LIMITATIONS[plan];
  return limitation || PLAN_LIMITATIONS.FREE;
}