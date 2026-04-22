import { Box, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { FiMail } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth/AuthContext'
import { useEmailOnlyLogin } from '../../hooks/useOTP'
import CustomIconLoadingButton from '../UI/button/CustomLoadingButton'
import CustomInput from '../UI/inputs/CustomInput'
import { getAuthErrorMessage } from './getAuthErrorMessage'
import { brand } from '../../theme/brand'

export default function OtpLoginPanel() {
  const navigate = useNavigate()
  const { setTokens, setUserId } = useAuth()
  const [email, setEmail] = useState(sessionStorage.getItem('activeEmail') ?? '')
  const [error, setError] = useState('')

  const { mutate: emailOnlyLogin, isPending } = useEmailOnlyLogin()

  const emailError = useMemo(() => {
    if (!email) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
    return ''
  }, [email])

  const handleLogin = (event?: React.FormEvent) => {
    event?.preventDefault()

    if (emailError) {
      setError(emailError)
      return
    }

    setError('')
    emailOnlyLogin(email.trim().toLowerCase(), {
      onSuccess: ({ token, refreshToken, user }) => {
        sessionStorage.setItem('activeEmail', email.trim().toLowerCase())
        setUserId(user?.id)
        setTokens(token, refreshToken)
        navigate('/app', { replace: true })
      },
      onError: (err: any) => {
        setError(getAuthErrorMessage(err, 'Login failed'))
      },
    })
  }

  return (
    <Stack spacing={2.2} className="shiporbit-auth-form-card">
      <Typography sx={{ color: brand.inkSoft, lineHeight: 1.7, fontSize: '0.9rem' }}>
        Use your registered email for quick login. Enter your email and continue directly.
      </Typography>

      <Box component="form" onSubmit={handleLogin}>
        <CustomInput
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          name="email"
          id="email-login"
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

        <CustomIconLoadingButton
          type="submit"
          text="Login"
          loading={isPending}
          loadingText="Logging in..."
          disabled={Boolean(emailError)}
          styles={{ width: '100%', marginTop: '18px' }}
        />
      </Box>
    </Stack>
  )
}
