import { alpha, Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import {
  MdAdd,
  MdCalculate,
  MdLockOutline,
  MdLocalShipping,
  MdShoppingCart,
  MdSupport,
  MdTrackChanges,
} from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { useMerchantReadiness } from '../../hooks/useMerchantReadiness'
import { brand } from '../../theme/brand'

export default function QuickActionsCard() {
  const navigate = useNavigate()
  const { isReady, firstIncompleteStep } = useMerchantReadiness()

  const actions = [
    { label: 'Create Order', icon: <MdAdd size={18} />, path: '/orders/create' },
    { label: 'All Orders', icon: <MdShoppingCart size={18} />, path: '/orders/list' },
    { label: 'Rate Calculator', icon: <MdCalculate size={18} />, path: '/tools/rate_calculator' },
    { label: 'Track AWB', icon: <MdTrackChanges size={18} />, path: '/tools/order_tracking' },
    { label: 'Support', icon: <MdSupport size={18} />, path: '/support/tickets' },
    { label: 'Shipments', icon: <TbTruckDelivery size={18} />, path: '/orders/list' },
  ]

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '16px',
        border: `1px solid ${alpha(brand.ink, 0.08)}`,
        boxShadow: `0 10px 24px ${alpha(brand.ink, 0.04)}`,
        backgroundColor: '#ffffff',
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" mb={2.2}>
          <Box
            sx={{
              p: 0.9,
              borderRadius: '10px',
              bgcolor: alpha(brand.accent, 0.1),
              color: brand.accent,
              display: 'flex',
            }}
          >
            <MdLocalShipping size={20} />
          </Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: brand.ink, letterSpacing: -0.2 }}>
            Quick Actions
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          {actions.map((action) => {
            const locked = action.path === '/orders/create' && !isReady

            return (
              <Grid size={{ xs: 6 }} key={action.label}>
                <Box
                  onClick={() => navigate(locked ? firstIncompleteStep?.path || '/home' : action.path)}
                  sx={{
                    p: 1.4,
                    borderRadius: '14px',
                    border: `1px solid ${alpha(brand.ink, 0.08)}`,
                    bgcolor: locked ? alpha(brand.warning, 0.08) : '#fff',
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                    '&:hover': {
                      bgcolor: locked ? alpha(brand.warning, 0.12) : alpha(brand.accent, 0.05),
                      borderColor: locked ? brand.warning : brand.accent,
                      transform: 'translateY(-1.5px)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        color: locked ? brand.warning : brand.accent,
                        bgcolor: locked
                          ? alpha(brand.warning, 0.14)
                          : alpha(brand.accent, 0.1),
                      }}
                    >
                      {locked ? <MdLockOutline size={18} /> : action.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: locked ? brand.warning : brand.ink,
                        lineHeight: 1.2,
                      }}
                    >
                      {locked ? 'Unlock' : action.label}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </CardContent>
    </Card>
  )
}
