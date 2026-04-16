import { alpha, Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import {
  MdAccountBalance,
  MdAccountBalanceWallet,
  MdShoppingCart,
  MdLocalShipping,
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { brand } from '../../theme/brand'

interface QuickStatsCardsProps {
  todayOps: {
    orders: number
    pending: number
    inTransit: number
    delivered: number
  }
  financial: {
    walletBalance: number
    codRemittanceDue: number
  }
  trends: {
    ordersGrowth: number
  }
  formatCurrency: (amount: number) => string
}

export default function QuickStatsCards({
  todayOps,
  financial,
  formatCurrency,
}: QuickStatsCardsProps) {
  const navigate = useNavigate()

  const stats = [
    {
      title: 'Active Shipments',
      value: todayOps.orders?.toLocaleString() || '0',
      subtitle: `${todayOps.delivered || 0} delivered today`,
      icon: <MdShoppingCart size={20} />,
      color: brand.accent,
      onClick: () => navigate('/orders/list'),
    },
    {
      title: 'In Transit',
      value: todayOps.inTransit?.toLocaleString() || '0',
      subtitle: `${todayOps.pending || 0} pending pickup`,
      icon: <MdLocalShipping size={20} />,
      color: brand.ink,
      onClick: () => navigate('/orders/list'),
    },
    {
      title: 'Wallet Funds',
      value: formatCurrency(financial.walletBalance || 0),
      subtitle: financial.walletBalance < 500 ? 'Recharge required' : 'Sufficient funds',
      icon: <MdAccountBalanceWallet size={20} />,
      color: brand.warning,
      onClick: () => navigate('/billing/wallet_transactions'),
    },
    {
      title: 'COD Remittance',
      value: formatCurrency(financial.codRemittanceDue || 0),
      subtitle: 'Awaiting bank transfer',
      icon: <MdAccountBalance size={20} />,
      color: brand.success,
      onClick: () => navigate('/cod-remittance'),
    },
  ]

  return (
    <Grid container spacing={2} mb={3}>
      {stats.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card
            onClick={stat.onClick}
            sx={{
              borderRadius: '16px',
              border: `1px solid ${alpha(brand.ink, 0.08)}`,
              boxShadow: `0 10px 24px ${alpha(brand.ink, 0.04)}`,
              cursor: 'pointer',
              transition: 'all .2s ease',
              backgroundColor: '#ffffff',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 16px 28px ${alpha(brand.ink, 0.08)}`,
                borderColor: alpha(stat.color, 0.4),
              },
            }}
          >
            <CardContent sx={{ p: 2.2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: alpha(brand.ink, 0.55),
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Box
                    sx={{
                      p: 0.8,
                      borderRadius: 1,
                      bgcolor: alpha(stat.color, 0.08),
                      color: stat.color,
                      display: 'flex',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Stack>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: brand.ink,
                      letterSpacing: -0.5,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: stat.subtitle.includes('Recharge') || stat.subtitle.includes('pending')
                        ? brand.danger
                        : brand.success,
                      fontWeight: 700,
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
