import { getAuthTokens } from './tokenVault'

const DEMO_DELAY_MS = 250

const delay = (ms = DEMO_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

const makeToken = (kind: 'access' | 'refresh', email: string) =>
  `${kind}.${email}.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`

const buildDemoUser = (email: string) => ({
  id: 'demo-user',
  phone: '',
  phoneVerified: false,
  email: email.trim().toLowerCase(),
  emailVerified: true,
  role: 'customer',
})

export interface DemoAuthUser {
  id: string
  phone: string
  phoneVerified: boolean
  email: string
  emailVerified: boolean
  role: string
}

export interface DemoSessionResponse {
  message: string
  token: string
  refreshToken: string
  user: DemoAuthUser
}

export interface DemoVerificationResponse extends DemoSessionResponse {
  message: string
  verificationToken: string
  email: string
  hasPassword: boolean
}

export const requestOtpApi = async (email: string) => {
  await delay()
  return {
    message: 'Demo mode: verification code displayed inline only',
    otp: '123456',
    email: email.trim().toLowerCase(),
  }
}

export const loginWithEmailOnlyApi = async (email: string) => {
  await delay()
  const normalizedEmail = email.trim().toLowerCase()
  return {
    message: 'Demo quick login successful',
    token: makeToken('access', normalizedEmail),
    refreshToken: makeToken('refresh', normalizedEmail),
    user: buildDemoUser(normalizedEmail),
  }
}

export const verifyOtpApi = async (email: string, otp: string) => {
  await delay()
  return {
    message: 'Demo OTP verified successfully',
    token: makeToken('access', email.trim().toLowerCase()),
    refreshToken: makeToken('refresh', email.trim().toLowerCase()),
    user: buildDemoUser(email),
    otp: otp.trim(),
  }
}

export const requestPasswordLoginApi = async (
  email: string,
  password?: string
): Promise<DemoVerificationResponse> => {
  await delay()
  return {
    message: 'Demo verification code generated',
    verificationToken: 'ABCD1234',
    email: email.trim().toLowerCase(),
    hasPassword: Boolean(password),
    token: makeToken('access', email.trim().toLowerCase()),
    refreshToken: makeToken('refresh', email.trim().toLowerCase()),
    user: buildDemoUser(email),
  }
}

export const loginWithEmailApi = async (email: string, password: string) => {
  await delay()
  const normalizedEmail = email.trim().toLowerCase()
  return {
    message: 'Demo login successful',
    token: makeToken('access', normalizedEmail),
    refreshToken: makeToken('refresh', normalizedEmail),
    user: buildDemoUser(normalizedEmail),
    passwordLength: password.length,
  }
}

export const verifyEmailOtpApi = async (
  email: string,
  otp: string,
  password: string
) => {
  await delay()
  const normalizedEmail = email.trim().toLowerCase()
  return {
    message: 'Demo email verification successful',
    token: makeToken('access', normalizedEmail),
    refreshToken: makeToken('refresh', normalizedEmail),
    user: buildDemoUser(normalizedEmail),
    verificationToken: otp.trim().toUpperCase(),
    passwordLength: password.length,
  }
}

export const googleLoginApi = async (code: string) => {
  await delay()
  const demoEmail = `google.${code.trim().toLowerCase() || 'user'}@demo.local`
  return {
    message: 'Demo Google login successful',
    token: makeToken('access', demoEmail),
    refreshToken: makeToken('refresh', demoEmail),
    user: buildDemoUser(demoEmail),
  }
}

export const logoutApi = async () => {
  await delay(100)
  void getAuthTokens()
}

/** Payload accepted by the backend */
export interface ChangePasswordPayload {
  newPassword: string;
  currentPassword?: string; // optional when the user has no existing password
}

/**
 * PATCH /api/account/password
 * (Auth cookie / bearer handled by interceptors)
 */
export const changePassword = (data: ChangePasswordPayload) =>
  Promise.resolve({
    data: {
      message: 'Demo mode: password change is disabled',
      requested: data,
    },
  });
