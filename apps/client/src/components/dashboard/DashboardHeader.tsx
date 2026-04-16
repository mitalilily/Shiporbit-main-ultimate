import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { MdDashboardCustomize, MdRefresh } from 'react-icons/md'
import { brand } from '../../theme/brand'

interface DashboardHeaderProps {
  isRefetching: boolean
  onRefresh: () => void
  onCustomize?: () => void
}

export default function DashboardHeader({
  isRefetching,
  onRefresh,
  onCustomize,
}: DashboardHeaderProps) {
  return (
    <Box
      sx={{
        mb: 2.8,
        p: { xs: 2.2, md: 2.8 },
        borderRadius: '24px',
        border: `1px solid ${alpha('#FFFFFF', 0.16)}`,
        background: `
          radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.18) 0%, transparent 22%),
          linear-gradient(135deg, #1f31ff 0%, #3558ff 54%, #3e97ff 100%)
        `,
        color: '#FFFFFF',
        boxShadow: '0 22px 44px rgba(31, 49, 255, 0.22)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        gap={1.4}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '1.45rem', md: '2.05rem' },
              fontWeight: 800,
              mb: 0.5,
              letterSpacing: '-0.05em',
            }}
          >
            Logistics Command Center
          </Typography>
          <Typography sx={{ fontSize: '0.94rem', color: alpha('#FFFFFF', 0.86), fontWeight: 500 }}>
            Real-time fulfillment metrics, operational insight, and dispatch visibility.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.2}>
          {onCustomize && (
            <Button
              onClick={onCustomize}
              variant="outlined"
              startIcon={<MdDashboardCustomize size={18} />}
              sx={{
                borderColor: alpha('#FFFFFF', 0.3),
                color: '#FFFFFF',
                backgroundColor: alpha('#FFFFFF', 0.08),
                '&:hover': {
                  borderColor: alpha('#FFFFFF', 0.36),
                  backgroundColor: alpha('#FFFFFF', 0.12),
                },
              }}
            >
              Customize
            </Button>
          )}

          <Button
            onClick={onRefresh}
            disabled={isRefetching}
            variant="contained"
            startIcon={
              isRefetching ? (
                <CircularProgress size={14} thickness={4} sx={{ color: '#ffffff' }} />
              ) : (
                <MdRefresh size={18} />
              )
            }
            sx={{
              background: '#FFFFFF',
              color: brand.ink,
              '&:hover': {
                background: alpha('#FFFFFF', 0.92),
              },
            }}
          >
            {isRefetching ? 'Updating...' : 'Refresh Feed'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
