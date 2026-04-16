import { Box, FormControlLabel, Link, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { FiMail, FiUser } from 'react-icons/fi'
import { MdBusinessCenter, MdLocalPhone, MdPassword } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth/AuthContext'
import { useRequestPasswordLogin, useVerifyEmailOtp } from '../../hooks/useRequestPasswordLogin'
import { TERMS_AND_CONDITIONS } from '../../utils/constants'
import { setOnboardingPrefill } from '../../utils/onboardingPrefill'
import CustomIconLoadingButton from '../UI/button/CustomLoadingButton'
import CustomCheckbox from '../UI/inputs/CustomCheckbox'
import CustomInput from '../UI/inputs/CustomInput'
import CustomSelect from '../UI/inputs/CustomSelect'
import CustomModal from '../UI/modal/CustomModal'
import { toast } from '../UI/Toast'
import { getAuthErrorMessage } from './getAuthErrorMessage'
import AuthCodePreview from './AuthCodePreview'
import CodeInput from './CodeInput'
import { extractInlineCode } from './inlineCode'
import { brand } from '../../theme/brand'

const INLINE_VERIFY_STORAGE_KEY = 'shiporbit:inline-verification-token'

interface CredentialAuthFormProps {
  mode: 'login' | 'signup'
  audience?: 'seller' | 'buyer'
}

const MONTHLY_ORDER_OPTIONS = [
  { key: '0-100', label: '0 - 100 orders / month' },
  { key: '101-500', label: '101 - 500 orders / month' },
  { key: '501-2000', label: '501 - 2000 orders / month' },
  { key: '2000+', label: '2000+ orders / month' },
]

const BUSINESS_TYPE_OPTIONS = [
  { key: 'fashion', label: 'Fashion & Lifestyle' },
  { key: 'beauty', label: 'Beauty & Personal Care' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'home', label: 'Home & Decor' },
  { key: 'food', label: 'Food & Grocery' },
  { key: 'other', label: 'Other' },
]

export default function CredentialAuthForm({ mode, audience = 'seller' }: CredentialAuthFormProps) {
  const navigate = useNavigate()
  const { setTokens, setUserId } = useAuth()
  const [step, setStep] = useState<'form' | 'verify'>(() =>
    typeof window !== 'undefined' && sessionStorage.getItem(INLINE_VERIFY_STORAGE_KEY)
      ? 'verify'
      : 'form',
  )
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [monthlyOrder, setMonthlyOrder] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [email, setEmail] = useState(sessionStorage.getItem('activeEmail') ?? '')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [termsChecked, setTermsChecked] = useState(false)
  const [inlineCode, setInlineCode] = useState(
    () =>
      typeof window !== 'undefined' ? sessionStorage.getItem(INLINE_VERIFY_STORAGE_KEY) ?? '' : '',
  )
  const [openTerms, setOpenTerms] = useState(false)
  const [error, setError] = useState('')

  const { mutate: requestPasswordAccess, isPending: requesting } = useRequestPasswordLogin()
  const { mutate: verifyEmailOtp, isPending: verifying } = useVerifyEmailOtp()

  const emailError = useMemo(() => {
    if (!email) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
    return ''
  }, [email])

  const passwordError = useMemo(() => {
    if (!password) return 'Password is required.'
    if (password.length < 6) return 'Minimum 6 characters required.'
    return ''
  }, [password])

  const nameError = useMemo(() => {
    if (mode !== 'signup') return ''
    if (!name.trim()) return 'Name is required.'
    return ''
  }, [mode, name])

  const companyNameError = useMemo(() => {
    if (mode !== 'signup' || audience !== 'seller') return ''
    if (!companyName.trim()) return 'Company name is required.'
    return ''
  }, [audience, companyName, mode])

  const mobileError = useMemo(() => {
    if (mode !== 'signup') return ''
    if (!mobileNumber.trim()) return 'Mobile number is required.'
    if (!/^\d{10}$/.test(mobileNumber.trim())) return 'Enter a valid 10-digit mobile number.'
    return ''
  }, [mobileNumber, mode])

  const monthlyOrderError = useMemo(() => {
    if (mode !== 'signup' || audience !== 'seller') return ''
    if (!monthlyOrder) return 'Monthly order range is required.'
    return ''
  }, [audience, mode, monthlyOrder])

  const businessTypeError = useMemo(() => {
    if (mode !== 'signup' || audience !== 'seller') return ''
    if (!businessType) return 'Business type is required.'
    return ''
  }, [audience, businessType, mode])

  const handleRequest = (event?: React.FormEvent) => {
    event?.preventDefault()

    const formError =
      nameError ||
      companyNameError ||
      mobileError ||
      emailError ||
      monthlyOrderError ||
      businessTypeError ||
      passwordError

    if (formError) {
      setError(formError)
      return
    }

    if (!termsChecked) {
      toast.open({
        message: 'Accept the Terms and Conditions to continue.',
        severity: 'warning',
      })
      return
    }

    setError('')
    if (mode === 'signup') {
      setOnboardingPrefill(name, {
        companyName: audience === 'seller' ? companyName.trim() : '',
        mobileNumber: mobileNumber.trim(),
        monthlyOrder: audience === 'seller' ? monthlyOrder : '',
        businessType: audience === 'seller' ? businessType : '',
        accountType: audience,
      })
    }

    requestPasswordAccess(
      {
        email: email.trim().toLowerCase(),
        password,
      },
      {
        onSuccess: (response: any) => {
          const verificationCode = extractInlineCode(response)
          setInlineCode(verificationCode)
          if (verificationCode) {
            sessionStorage.setItem(INLINE_VERIFY_STORAGE_KEY, verificationCode)
            sessionStorage.setItem('activeEmail', email.trim().toLowerCase())
          } else {
            sessionStorage.removeItem(INLINE_VERIFY_STORAGE_KEY)
          }

          if (response?.token && response?.refreshToken) {
            sessionStorage.removeItem(INLINE_VERIFY_STORAGE_KEY)
            sessionStorage.setItem('activeEmail', email.trim().toLowerCase())
            setUserId(response?.user?.id)
            setTokens(response.token, response.refreshToken)
            navigate('/app', { replace: true })
            return
          }

          if (verificationCode || response?.message?.includes('Verification')) {
            setStep('verify')
            setCode('')
            toast.open({
              message: verificationCode
                ? 'Verification code generated. Use the inline preview below.'
                : 'Verification code sent to your email.',
              severity: 'success',
            })
            return
          }

          if (response?.message) {
            toast.open({
              message: response.message,
              severity: 'success',
            })
          }
        },
        onError: (err: any) => {
          setError(getAuthErrorMessage(err, 'Authentication failed'))
        },
      },
    )
  }

  const handleVerify = (event?: React.FormEvent) => {
    event?.preventDefault()

    if (code.length !== 8) {
      setError('Enter the full 8-character verification code.')
      return
    }

    setError('')
    verifyEmailOtp(
      {
        email: email.trim().toLowerCase(),
        otp: code,
        password,
      },
      {
        onSuccess: ({ token, refreshToken, user }) => {
          sessionStorage.removeItem(INLINE_VERIFY_STORAGE_KEY)
          sessionStorage.setItem('activeEmail', email.trim().toLowerCase())
          setUserId(user?.id)
          setTokens(token, refreshToken)
          navigate('/app', { replace: true })
        },
        onError: (err: any) => {
          setError(getAuthErrorMessage(err, 'Verification failed'))
        },
      },
    )
  }

  return (
    <Stack spacing={2.2} className="shiporbit-auth-form-card">
      <Box>
        {mode === 'signup' ? (
          <Typography
            sx={{
              color: brand.ink,
              fontSize: '1rem',
              fontWeight: 800,
              mb: 0.85,
            }}
          >
            {audience === 'seller' ? 'Seller details' : 'Buyer details'}
          </Typography>
        ) : null}
        <Typography sx={{ color: brand.inkSoft, lineHeight: 1.7, fontSize: '0.9rem' }}>
          {mode === 'signup'
            ? audience === 'seller'
              ? 'Fill in your account details below to continue with the seller signup flow.'
              : 'Fill in your account details below to continue with the buyer signup flow.'
            : 'Use your registered email for passwordless login. When the backend exposes an inline code, it appears below on screen.'}
        </Typography>
      </Box>

      <Box className="shiporbit-auth-subcard">
        <AuthCodePreview
          title={mode === 'signup' ? 'Signup verification code' : 'Inline verification code'}
          code={inlineCode}
          helper="Use this code directly during development when inline verification exposure is enabled."
        />
      </Box>

      {step === 'form' ? (
        <Stack component="form" spacing={1.1} onSubmit={handleRequest}>
          {mode === 'signup' ? (
            <CustomInput
              label="Name"
              name="fullName"
              placeholder="Enter Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              helperText={name ? nameError : ''}
              error={Boolean(name) && Boolean(nameError)}
              prefix={<FiUser color={brand.ink} size={15} />}
              autoFocus
              required
              topMargin={false}
            />
          ) : null}

          {mode === 'signup' && audience === 'seller' ? (
            <CustomInput
              label="Company Name"
              name="companyName"
              placeholder="Enter Company Name"
              value={companyName}
              onChange={(event) => {
                setCompanyName(event.target.value)
                setError('')
              }}
              helperText={companyName ? companyNameError : ''}
              error={Boolean(companyName) && Boolean(companyNameError)}
              prefix={<MdBusinessCenter color={brand.ink} size={15} />}
              required
            />
          ) : null}

          {mode === 'signup' ? (
            <CustomInput
              label="Mobile Number"
              name="mobileNumber"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChange={(event) => {
                setMobileNumber(event.target.value.replace(/\D/g, '').slice(0, 10))
                setError('')
              }}
              helperText={mobileNumber ? mobileError : ''}
              error={Boolean(mobileNumber) && Boolean(mobileError)}
              prefix={<MdLocalPhone color={brand.ink} size={15} />}
              required
            />
          ) : null}

          <CustomInput
            label={mode === 'signup' ? 'Email Address' : 'Email'}
            name="email"
            type="email"
            placeholder="Enter Username"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            helperText={email ? emailError : ''}
            error={Boolean(email) && Boolean(emailError)}
            prefix={<FiMail color={brand.ink} size={15} />}
            required
            topMargin={mode !== 'signup'}
          />

          {mode === 'signup' && audience === 'seller' ? (
            <CustomSelect
              label="Monthly Order"
              items={MONTHLY_ORDER_OPTIONS}
              value={monthlyOrder}
              onSelect={(value) => {
                setMonthlyOrder(String(value))
                setError('')
              }}
              placeholder="Choose..."
              required
              searchable={false}
              error={Boolean(monthlyOrderError)}
              helperText={monthlyOrder ? monthlyOrderError : ''}
            />
          ) : null}

          {mode === 'signup' && audience === 'seller' ? (
            <CustomSelect
              label="Business type"
              items={BUSINESS_TYPE_OPTIONS}
              value={businessType}
              onSelect={(value) => {
                setBusinessType(String(value))
                setError('')
              }}
              placeholder="Choose..."
              required
              searchable={false}
              error={Boolean(businessTypeError)}
              helperText={businessType ? businessTypeError : ''}
            />
          ) : null}

          <CustomInput
            label={mode === 'signup' ? 'Password' : 'Password'}
            name="password"
            type="password"
            placeholder="Input password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            helperText={password ? passwordError : ''}
            error={Boolean(password) && Boolean(passwordError)}
            prefix={<MdPassword color={brand.ink} size={16} />}
            required
          />

          {error ? (
            <Typography sx={{ color: brand.danger, fontSize: '0.82rem', fontWeight: 700, mt: 0.5 }}>
              {error}
            </Typography>
          ) : null}

          <FormControlLabel
            sx={{ mt: 0.5, mb: 1.2, alignItems: 'flex-start' }}
            control={
              <CustomCheckbox
                checked={termsChecked}
                onChange={(event) => setTermsChecked(event.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography sx={{ color: brand.inkSoft, fontSize: '0.86rem', mt: 0.25 }}>
                I agree to{' '}
                <Link
                  component="button"
                  underline="hover"
                  onClick={() => setOpenTerms(true)}
                  sx={{ color: brand.ink, fontWeight: 700 }}
                >
                  Terms and Conditions
                </Link>
              </Typography>
            }
          />

          <CustomIconLoadingButton
            type="submit"
            text={mode === 'signup' ? 'Sign Up' : 'Submit'}
            loading={requesting}
            loadingText={mode === 'signup' ? 'Creating...' : 'Checking...'}
            disabled={
              Boolean(
                nameError ||
                  companyNameError ||
                  mobileError ||
                  emailError ||
                  monthlyOrderError ||
                  businessTypeError ||
                  passwordError,
              ) || !termsChecked
            }
            styles={{ width: '100%' }}
          />
        </Stack>
      ) : (
        <Stack component="form" spacing={2} onSubmit={handleVerify}>
          <Box className="shiporbit-auth-subcard">
            <Typography sx={{ color: brand.ink, lineHeight: 1.68, fontSize: '0.9rem' }}>
              Enter the 8-character verification code for <strong>{email}</strong>.
            </Typography>
          </Box>

          <CodeInput length={8} mode="alphanumeric" value={code} onChange={setCode} />

          {error ? (
            <Typography sx={{ color: brand.danger, textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
              {error}
            </Typography>
          ) : null}

          <CustomIconLoadingButton
            type="submit"
            text={mode === 'signup' ? 'Verify Email' : 'Verify Code'}
            loading={verifying}
            loadingText="Verifying..."
            disabled={code.length !== 8}
            styles={{ width: '100%' }}
          />

          <CustomIconLoadingButton
            type="button"
            text="Resend Code"
            variant="text"
            loading={requesting}
            loadingText="Sending..."
            onClick={() => handleRequest()}
            styles={{ width: '100%' }}
          />
        </Stack>
      )}

      <CustomModal
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        title="Terms and Conditions"
      >
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-line',
            maxHeight: '60vh',
            overflowY: 'auto',
            pr: 1,
          }}
        >
          {TERMS_AND_CONDITIONS}
        </Typography>
      </CustomModal>
    </Stack>
  )
}
