import { alpha, Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import CredentialAuthForm from '../../components/auth/CredentialAuthForm'
import OtpLoginPanel from '../../components/auth/OtpLoginPanel'
import FullScreenLoader from '../../components/UI/loader/FullScreenLoader'
import { useAuth } from '../../context/auth/AuthContext'
import { brand, brandGradients } from '../../theme/brand'

export default function Login() {
  const { loading, isAuthenticated, user, logout } = useAuth()
  const [mode, setMode] = useState<'email' | 'password'>('email')

  if (loading) return <FullScreenLoader />

  const onboardingComplete = Boolean(user?.onboardingComplete)
  const continuePath = onboardingComplete ? '/dashboard' : '/onboarding-questions'
  const continueLabel = onboardingComplete ? 'Continue to dashboard' : 'Continue setup'

  return (
    <AuthShell
      panelTitle={null}
      actions={
        <Box className="shiporbit-auth-card shiporbit-auth-actions-card">
          <Stack spacing={1.1} alignItems="flex-start">
            <Typography className="shiporbit-auth-actions-copy">
              <strong>ShipOrbit</strong>
            </Typography>
            <Typography className="shiporbit-auth-actions-copy">
              New to ShipOrbit? Start with the seller signup flow below.
            </Typography>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              sx={{
                minWidth: 148,
                borderRadius: '12px',
                px: 2.9,
                py: 1.15,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      }
    >
      <Stack spacing={2.25}>
        {isAuthenticated ? (
          <Box className="shiporbit-auth-card shiporbit-auth-session">
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.4}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography component="h4">Existing session detected</Typography>
                <Typography component="p">
                  Continue manually when you&apos;re ready, or switch accounts below.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  component={RouterLink}
                  to={continuePath}
                  variant="contained"
                  sx={{
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: 'none',
                  }}
                >
                  {continueLabel}
                </Button>
                <Button
                  type="button"
                  onClick={() => void logout()}
                  variant="outlined"
                  sx={{
                    borderRadius: '10px',
                    borderColor: alpha(brand.ink, 0.16),
                    color: brand.ink,
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  Switch account
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : null}

        <Box className="shiporbit-auth-card shiporbit-auth-switcher-card">
          <Box className="shiporbit-auth-switcher">
            {[
              { value: 'email', label: 'Email Login' },
              { value: 'password', label: 'Password' },
            ].map((item) => (
              <Button
                key={item.value}
                type="button"
                onClick={() => setMode(item.value as 'email' | 'password')}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  background: mode === item.value ? brandGradients.button : 'transparent',
                  color: mode === item.value ? '#FFFFFF' : brand.inkSoft,
                  fontWeight: 600,
                  boxShadow: 'none',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>

        {mode === 'email' ? <OtpLoginPanel /> : <CredentialAuthForm mode="login" />}

        <Typography sx={{ color: brand.inkSoft, textAlign: 'center', fontSize: '0.88rem' }}>
          Don&apos;t have an account?{' '}
          <Box component={RouterLink} to="/signup" sx={{ color: brand.accent, fontWeight: 600 }}>
            Create Account
          </Box>
        </Typography>
      </Stack>
    </AuthShell>
  )
}
