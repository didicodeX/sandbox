import { createAuthClient } from 'better-auth/react'

export const { signIn, signUp, signOut, useSession, resetPassword, requestPasswordReset, verifyEmail } = createAuthClient()
