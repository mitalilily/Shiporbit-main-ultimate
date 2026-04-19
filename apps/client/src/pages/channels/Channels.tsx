import { Box, Button, Stack, Typography } from '@mui/material'
import { FiPlus } from 'react-icons/fi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { brand } from '../../theme/brand'

const topTabs = [
  { label: 'Channel Order', path: '/channel/pending' },
  { label: 'Channel', path: '/channels' },
  { label: 'Add Channel', path: '/channel/addchannel' },
]

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

const Channels = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Box sx={{ p: '18px 18px 26px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Stack spacing={2}>
        <Box
          sx={{
            bgcolor: '#fff',
            border: '1px solid rgba(29, 40, 66, 0.1)',
            borderRadius: '14px',
            px: 1.5,
            py: 1.2,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', md: 'center' }}
            spacing={1.5}
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {topTabs.map((tab) => (
                <Button
                  key={tab.path}
                  component={NavLink}
                  to={tab.path}
                  sx={{
                    minHeight: 40,
                    px: 2,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: isPath(location.pathname, tab.path) ? '#fff' : '#4b5563',
                    bgcolor: isPath(location.pathname, tab.path) ? '#111' : '#f8fafc',
                    border: isPath(location.pathname, tab.path)
                      ? '1px solid #111'
                      : '1px solid #e5e7eb',
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>

            <Button
              startIcon={<FiPlus size={16} />}
              onClick={() => navigate('/channel/addchannel')}
              sx={{
                minHeight: 40,
                px: 1.8,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#fff',
                bgcolor: brand.accent,
              }}
            >
              Add Channel
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            bgcolor: '#fff',
            border: '1px solid rgba(29, 40, 66, 0.1)',
            borderRadius: '14px',
            minHeight: 420,
            display: 'grid',
            placeItems: 'center',
            p: 3,
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151' }}>
              No channels available.
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              Connect your first sales channel to start syncing orders.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default Channels
