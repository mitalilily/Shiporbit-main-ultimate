import { Box, Stack, Typography } from '@mui/material'
import { FiCheckCircle } from 'react-icons/fi'
import BrandLogo from '../brand/BrandLogo'

interface AuthShellProps {
  panelTitle: string
  panelSubtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

const authHighlights = [
  'One roof solution for all your shipping and courier operations',
  '29000+ Pin-Codes in India & 220+ Countries Worldwide',
  'Automated shipping process & Dedicated Account Manager',
  'Zero Dashboard Fee/ Zero Monthly Charges',
]

const authStats = [
  { value: '25K', label: 'Businesses use our Superpower' },
  { value: '20+', label: 'Courier Partners' },
]

export default function AuthShell({
  panelTitle,
  panelSubtitle,
  actions,
  children,
}: AuthShellProps) {
  return (
    <Box className="shiporbit-auth-shell">
      <Box className="shiporbit-auth-grid">
        <Box className="shiporbit-auth-hero">
          <Box className="shiporbit-auth-hero-copy">
            <Typography component="h3">
              An end-to-end logistics platform for faster e-commerce shipping
            </Typography>

            <Box component="ul">
              {authHighlights.map((item) => (
                <Box key={item} component="li">
                  <FiCheckCircle size={18} />
                  <span>{item}</span>
                </Box>
              ))}
            </Box>

            <Box className="shiporbit-auth-counters">
              {authStats.map((stat) => (
                <Box key={stat.label} className="shiporbit-auth-counter">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box className="shiporbit-auth-panel">
          <Box className="shiporbit-auth-panel-inner">
            <Stack spacing={2.4}>
              <Stack className="shiporbit-auth-top">
                <Box className="shiporbit-auth-brand">
                  <BrandLogo sx={{ width: { xs: 142, sm: 172 } }} />
                </Box>
                <Box>
                  <Typography component="h3" className="shiporbit-auth-panel-title">
                    {panelTitle}
                  </Typography>
                  {panelSubtitle ? (
                    <Typography className="shiporbit-auth-panel-subtitle">
                      {panelSubtitle}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>

              {actions}
              {children}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
