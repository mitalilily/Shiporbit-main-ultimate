import { alpha, Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import BuyerTrackingPanel from '../../components/auth/BuyerTrackingPanel'
import SellerSignupPanel from '../../components/auth/SellerSignupPanel'
import FullScreenLoader from '../../components/UI/loader/FullScreenLoader'
import { useAuth } from '../../context/auth/AuthContext'
import { brand, brandGradients } from '../../theme/brand'

export default function Signup() {
  const { loading, isAuthenticated, user, logout } = useAuth()
  const [accountType, setAccountType] = useState<'seller' | 'buyer'>('seller')

  if (loading) return <FullScreenLoader />

  const onboardingComplete = Boolean(user?.onboardingComplete)
  const continuePath = onboardingComplete ? '/dashboard' : '/onboarding-questions'
  const continueLabel = onboardingComplete ? 'Continue to dashboard' : 'Continue setup'

  return (
    <AuthShell
      panelTitle="Sign Up"
      panelSubtitle="Welcome! Start your shipping journey with us."
      actions={
        <Box className="shiporbit-auth-card shiporbit-auth-actions-card">
          <Stack spacing={0.9} alignItems="flex-start">
            <Typography className="shiporbit-auth-actions-copy">
              <strong>Existing user?</strong>
            </Typography>
            <Typography className="shiporbit-auth-actions-copy">
              Login to your current ShipOrbit account if you already have access.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                minWidth: 136,
                borderRadius: '12px',
                px: 2.7,
                py: 1.05,
                borderColor: alpha(brand.ink, 0.12),
                color: brand.ink,
                fontWeight: 800,
                textTransform: 'none',
              }}
            >
              Existing user login
            </Button>
          </Stack>
        </Box>
      }
    >
      <Stack spacing={2.4}>
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
                  Continue with your current account if you want to resume setup, or switch to create
                  a new one.
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
              { value: 'seller', label: 'Seller' },
              { value: 'buyer', label: 'Buyer' },
            ].map((item) => (
              <Button
                key={item.value}
                type="button"
                onClick={() => setAccountType(item.value as 'seller' | 'buyer')}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  background: accountType === item.value ? brandGradients.button : 'transparent',
                  color: accountType === item.value ? '#FFFFFF' : brand.inkSoft,
                  fontWeight: 700,
                  boxShadow: 'none',
                  textTransform: 'none',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>

        {accountType === 'seller' ? <SellerSignupPanel /> : <BuyerTrackingPanel />}

        <Typography sx={{ color: brand.inkSoft, textAlign: 'center', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Box component={RouterLink} to="/login" sx={{ color: brand.accent, fontWeight: 600 }}>
            Sign In
          </Box>
        </Typography>
      </Stack>
    </AuthShell>
  )
}
