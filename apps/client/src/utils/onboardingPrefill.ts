const SIGNUP_PREFILL_KEY = 'signupOnboardingPrefill'

interface SignupOnboardingPrefill {
  firstName: string
  lastName: string
  companyName?: string
  mobileNumber?: string
  monthlyOrder?: string
  businessType?: string
  accountType?: 'seller' | 'buyer'
}

const splitName = (fullName: string) => {
  const trimmed = fullName.trim().replace(/\s+/g, ' ')
  if (!trimmed) {
    return { firstName: '', lastName: '' }
  }

  const [firstName = '', ...rest] = trimmed.split(' ')
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

export const setOnboardingPrefill = (
  fullName: string,
  extras?: Omit<SignupOnboardingPrefill, 'firstName' | 'lastName'>,
) => {
  if (typeof window === 'undefined') return
  const payload: SignupOnboardingPrefill = {
    ...splitName(fullName),
    ...extras,
  }
  sessionStorage.setItem(SIGNUP_PREFILL_KEY, JSON.stringify(payload))
}

export const getOnboardingPrefill = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = sessionStorage.getItem(SIGNUP_PREFILL_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SignupOnboardingPrefill
  } catch {
    return null
  }
}

export const clearOnboardingPrefill = () => {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SIGNUP_PREFILL_KEY)
}
