import { Box, Button, Stack, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'

const topTabs = [
  { label: 'Channel Order', path: '/channel/pending' },
  { label: 'Channel', path: '/channels' },
  { label: 'Add Channel', path: '/channel/addchannel' },
]

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

export default function AddChannel() {
  const location = useLocation()

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
                  border: isPath(location.pathname, tab.path) ? '1px solid #111' : '1px solid #e5e7eb',
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            bgcolor: '#fff',
            border: '1px solid rgba(29, 40, 66, 0.1)',
            borderRadius: '14px',
            minHeight: 420,
            p: 3,
          }}
        >
          <Box
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              minHeight: 320,
              display: 'grid',
              placeItems: 'center',
              background: '#fafafa',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontSize: { xs: '1.2rem', md: '1.45rem' },
                fontWeight: 700,
                color: '#4b5563',
                textAlign: 'center',
              }}
            >
              Partners Coming Soon
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
