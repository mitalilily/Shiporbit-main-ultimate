import { Box, FormControlLabel, Link, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { FiMail } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth/AuthContext'
import { useRequestOtp, useVerifyOtp } from '../../hooks/useOTP'
import { TERMS_AND_CONDITIONS } from '../../utils/constants'
import CustomIconLoadingButton from '../UI/button/CustomLoadingButton'
import CustomCheckbox from '../UI/inputs/CustomCheckbox'
import CustomInput from '../UI/inputs/CustomInput'
import CustomModal from '../UI/modal/CustomModal'
import { toast } from '../UI/Toast'
import { getAuthErrorMessage } from './getAuthErrorMessage'
import AuthCodePreview from './AuthCodePreview'
import CodeInput from './CodeInput'
import { extractInlineCode } from './inlineCode'
import { brand } from '../../theme/brand'

const INLINE_OTP_STORAGE_KEY = 'shiporbit:inline-otp'

export default function OtpLoginPanel() {
  const navigate = useNavigate()
  const { setTokens, setUserId } = useAuth()
  const [step, setStep] = useState<'request' | 'verify'>(() =>
    typeof window !== 'undefined' && sessionStorage.getItem(INLINE_OTP_STORAGE_KEY)
      ? 'verify'
      : 'request',
  )
  const [email, setEmail] = useState(sessionStorage.getItem('activeEmail') ?? '')
  const [code, setCode] = useState('')
  const [termsChecked, setTermsChecked] = useState(false)
  const [inlineOtp, setInlineOtp] = useState(
    () => (typeof window !== 'undefined' ? sessionStorage.getItem(INLINE_OTP_STORAGE_KEY) ?? '' : ''),
  )
  const [error, setError] = useState('')
  const [openTerms, setOpenTerms] = useState(false)

  const { mutate: requestOtp, isPending: requesting } = useRequestOtp()
  const { mutate: verifyOtp, isPending: verifying } = useVerifyOtp()

  const emailError = useMemo(() => {
    if (!email) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
    return ''
  }, [email])

  const handleRequest = (event?: React.FormEvent) => {
    event?.preventDefault()

    if (emailError) {
      setError(emailError)
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
    requestOtp(email.trim().toLowerCase(), {
      onSuccess: (response: any) => {
        const inlineCode = extractInlineCode(response)
        setInlineOtp(inlineCode)
        if (inlineCode) {
          sessionStorage.setItem(INLINE_OTP_STORAGE_KEY, inlineCode)
        } else {
          sessionStorage.removeItem(INLINE_OTP_STORAGE_KEY)
        }
        sessionStorage.setItem('activeEmail', email.trim().toLowerCase())
        setStep('verify')
        setCode('')
        toast.open({
          message: inlineCode
            ? 'Verification code generated. Use the inline code preview below.'
            : 'Verification code sent to your email.',
          severity: 'success',
        })
      },
      onError: (err: any) => {
        setError(getAuthErrorMessage(err, 'OTP request failed'))
      },
    })
  }

  const handleVerify = (event?: React.FormEvent) => {
    event?.preventDefault()

    if (code.length !== 6) {
      setError('Enter the full 6-digit verification code.')
      return
    }

    setError('')
    verifyOtp(
      { email, otp: code },
      {
        onSuccess: ({ token, refreshToken, user }) => {
          sessionStorage.removeItem(INLINE_OTP_STORAGE_KEY)
          sessionStorage.setItem('activeEmail', email.trim().toLowerCase())
          setUserId(user?.id)
          setTokens(token, refreshToken)
          navigate('/app', { replace: true })
        },
        onError: (err: any) => {
          setError(getAuthErrorMessage(err, 'OTP verification failed'))
        },
      },
    )
  }

  return (
    <Stack spacing={2.2} className="shiporbit-auth-form-card">
      <Typography sx={{ color: brand.inkSoft, lineHeight: 1.7, fontSize: '0.9rem' }}>
        Use your registered email for passwordless login. When the backend exposes an inline code,
        it appears below on screen.
      </Typography>

      <Box className="shiporbit-auth-subcard">
        <AuthCodePreview
          title="Inline OTP"
          code={inlineOtp}
          helper="Use this code directly during development when inline OTP exposure is enabled."
        />
      </Box>

      {step === 'request' ? (
        <Box component="form" onSubmit={handleRequest}>
          <CustomInput
            type="email"
            label="Email"
            placeholder="Enter your username"
            value={email}
            name="email"
            id="otp-email"
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            error={Boolean(error || emailError) && Boolean(email)}
            helperText={error || (email ? emailError : '')}
            prefix={<FiMail color={brand.ink} size={15} />}
            autoFocus
            required
            topMargin={false}
          />

          <FormControlLabel
            sx={{ mt: 1.2, mb: 2.2, alignItems: 'flex-start' }}
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
            text="Send OTP"
            loading={requesting}
            loadingText="Sending..."
            disabled={Boolean(emailError) || !termsChecked}
            styles={{ width: '100%' }}
          />
        </Box>
      ) : (
        <Stack component="form" onSubmit={handleVerify} spacing={2}>
          <Box className="shiporbit-auth-subcard">
            <Typography sx={{ color: brand.ink, lineHeight: 1.68, fontSize: '0.9rem' }}>
              Enter the 6-digit OTP sent to <strong>{email}</strong>.
            </Typography>
          </Box>

          <CodeInput length={6} mode="numeric" value={code} onChange={setCode} />

          {error ? (
            <Typography sx={{ color: brand.danger, textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
              {error}
            </Typography>
          ) : null}

          <CustomIconLoadingButton
            type="submit"
            text="Verify OTP"
            loading={verifying}
            loadingText="Verifying..."
            disabled={code.length !== 6}
            styles={{ width: '100%' }}
          />

          <CustomIconLoadingButton
            type="button"
            text="Resend OTP"
            variant="text"
            onClick={() => handleRequest()}
            loading={requesting}
            loadingText="Sending..."
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
