# Authentication Workflows Documentation

## Overview

This document describes two critical authentication workflows implemented in our SaaS application: **Email Verification** and **Password Reset**. These workflows follow security best practices and provide excellent user experience.

---

## 1. Email Verification Workflow

### Purpose

Ensure users verify their email address before accessing the application, preventing fake accounts and improving security.

### Configuration

#### Backend Setup (`app/lib/auth.ts`)

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true, // 🔑 Force email verification
  },

  emailVerification: {
    enabled: true, // 🔑 Enable verification system
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "noreply@yourdomain.com",
        to: user.email,
        subject: "Verify your email address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to our platform!</h2>
            <p>Hi ${user.name},</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${url}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Verify Email Address
            </a>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
      });
    },
  },
});
```

### Workflow Steps

#### 1. User Registration

- User fills signup form (`/auth/signup`)
- `signUp.email()` called with `callbackURL: "/auth/verify-email"`
- User created in database with `emailVerified: false`
- **Automatic email sent** with verification link
- User redirected to `/auth/verify-email` (without token)

#### 2. Email Delivery

- **Template includes**:
  - Professional HTML design
  - Clear call-to-action button
  - User's name for personalization
  - Expiration notice (24 hours)
  - Fallback URL for copy-paste

#### 3. Email Verification

- User clicks link: `https://domain.com/auth/verify-email?token=abc123...`
- Page `/auth/verify-email` detects token in URL
- `verifyEmail({ query: { token } })` called automatically
- Backend validates token and updates user: `emailVerified: true`
- Token invalidated (one-time use)

#### 4. User Feedback

- **4 distinct UI states**:
  - **No token**: Instructions to check email
  - **Verifying**: Loading spinner
  - **Success**: Confirmation + "Sign In" button
  - **Error**: Error message + recovery options

### Security Features

- ✅ Tokens are unique and single-use
- ✅ 24-hour expiration
- ✅ Server-side validation only
- ✅ Protection against brute force attacks

---

## 2. Password Reset Workflow

### Purpose

Allow users to securely reset their password when forgotten, with proper validation and security measures.

### Configuration

#### Backend Setup (`app/lib/auth.ts`)

```typescript
emailAndPassword: {
  sendResetPassword: async ({ user, url }) => {
    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the button below:</p>
          <a href="${url}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
        </div>
      `,
    });
  },
}
```

### Workflow Steps

#### 1. Password Reset Request (`/auth/forgot-password`)

- User enters email address
- **Client-side validation**: Email format check
- `requestPasswordReset()` called with `redirectTo: "/auth/reset-password"`
- **Email sent** with reset link (1-hour expiration)
- **Success state**: Confirmation page with security tips

#### 2. Email Delivery

- **Template includes**:
  - Red CTA button (urgency indication)
  - Security warning for unintended requests
  - 1-hour expiration notice
  - User's name for personalization

#### 3. Password Reset (`/auth/reset-password`)

- User clicks link: `https://domain.com/auth/reset-password?token=abc123...`
- **Token validation** before showing form
- **Password strength validation**:
  - Minimum 8 characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character
- **Password confirmation** required
- **Real-time feedback** with strength indicator

#### 4. Password Update

- `resetPassword({ newPassword, token })` called
- Backend validates token and updates password
- **Success state**: Confirmation + redirect to signin

### Security Features

- ✅ 1-hour token expiration (shorter than email verification)
- ✅ Password strength requirements
- ✅ Password confirmation
- ✅ Token validation before form display
- ✅ Single-use tokens

---

## Implementation Checklist

### Email Verification

- [ ] Configure `requireEmailVerification: true`
- [ ] Enable `emailVerification.enabled: true`
- [ ] Create professional email template
- [ ] Implement 4-state UI in verify-email page
- [ ] Handle token validation and user feedback
- [ ] Test complete workflow

### Password Reset

- [ ] Configure `sendResetPassword` function
- [ ] Create professional email template
- [ ] Implement forgot-password page with validation
- [ ] Implement reset-password page with strength validation
- [ ] Add password confirmation field
- [ ] Handle all error states
- [ ] Test complete workflow

---

## Best Practices

### Email Templates

- ✅ Professional HTML design
- ✅ Clear call-to-action buttons
- ✅ User personalization (name)
- ✅ Security warnings when appropriate
- ✅ Expiration notices
- ✅ Fallback URLs for copy-paste

### User Experience

- ✅ Clear loading states
- ✅ Informative error messages
- ✅ Success confirmations
- ✅ Intuitive navigation
- ✅ Real-time validation feedback
- ✅ Security tips and guidance

### Security

- ✅ Unique, single-use tokens
- ✅ Appropriate expiration times
- ✅ Server-side validation
- ✅ Password strength requirements
- ✅ Rate limiting (implemented by auth library)
- ✅ Secure email delivery

### Error Handling

- ✅ Invalid/expired tokens
- ✅ Non-existent email addresses
- ✅ Network errors
- ✅ Weak passwords
- ✅ Mismatched password confirmation

---

## Testing Scenarios

### Email Verification

1. **Happy path**: Signup → Email received → Click link → Verified
2. **Expired token**: Click old link → Error message
3. **Invalid token**: Manipulate URL → Error message
4. **No token**: Direct access to verify page → Instructions shown

### Password Reset

1. **Happy path**: Request reset → Email received → Set new password → Success
2. **Invalid email**: Request with non-existent email → 404 error
3. **Expired token**: Click old link → Error message
4. **Weak password**: Try weak password → Validation error
5. **Mismatched passwords**: Different confirmation → Error message

---

## Common Issues & Solutions

### Email not received

- Check spam folder
- Verify email configuration (Resend/SendGrid)
- Check domain reputation
- Implement email delivery monitoring

### Token validation errors

- Ensure proper token format
- Check expiration times
- Verify token storage in database
- Implement proper error logging

### Password validation issues

- Adjust strength requirements if too strict
- Provide clear feedback on requirements
- Consider progressive enhancement for UX

---

## Monitoring & Analytics

### Key Metrics to Track

- Email verification completion rate
- Password reset completion rate
- Email delivery success rate
- Token expiration rates
- User support tickets related to auth

### Logging

- Failed verification attempts
- Password reset requests
- Email delivery failures
- Security incidents (multiple failed attempts)

---

## Future Enhancements

### Email Verification

- [ ] Resend verification email option
- [ ] Multiple email addresses per account
- [ ] Email change verification
- [ ] Bulk email verification for admin

### Password Reset

- [ ] Password history (prevent reuse)
- [ ] Account lockout after failed attempts
- [ ] Two-factor authentication integration
- [ ] Password strength suggestions

---

_This documentation serves as a comprehensive guide for implementing secure authentication workflows in SaaS applications. Update as needed based on your specific requirements and security policies._
