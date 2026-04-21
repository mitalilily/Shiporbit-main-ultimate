import { Box, Button, Collapse, Container, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import BrandLogo from '../brand/BrandLogo'
import { brand } from '../../theme/brand'

type NavItem = {
  label: string
  to: string
}

interface PublicNavbarProps {
  links?: NavItem[]
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
}

export default function PublicNavbar({
  links = [],
  primaryLabel = 'Signup',
  primaryTo = '/signup',
  secondaryLabel = 'Login',
  secondaryTo = '/login',
}: PublicNavbarProps) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, location.hash])

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #eff2f7',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ minHeight: 86, gap: 2 }}
        >
          <RouterLink to="/landing" aria-label="ShipOrbit home">
            <BrandLogo sx={{ width: { xs: 132, sm: 140 } }} />
          </RouterLink>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ display: { xs: 'none', lg: 'flex' }, gap: 3.2 }}
          >
            {links.map((item) => {
              const isHash = item.to.startsWith('#')
              const isActive = !isHash && location.pathname === item.to

              return (
                <Box
                  key={`${item.label}-${item.to}`}
                  component={isHash ? 'a' : RouterLink}
                  href={isHash ? item.to : undefined}
                  to={isHash ? undefined : item.to}
                  sx={{
                    color: isActive ? brand.accent : '#1A1A1A',
                    fontSize: '1rem',
                    fontWeight: isActive ? 500 : 400,
                    lineHeight: 1,
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: brand.accent,
                    },
                  }}
                >
                  {item.label}
                </Box>
              )
            })}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.4}>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Button
                component={RouterLink}
                to={primaryTo}
                variant="contained"
                sx={{
                  minWidth: 104,
                  borderRadius: '10px',
                  px: 3,
                  py: 1.45,
                  bgcolor: '#FF6600',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#e85b00',
                    boxShadow: 'none',
                  },
                }}
              >
                {primaryLabel}
              </Button>
              <Button
                component={RouterLink}
                to={secondaryTo}
                variant="contained"
                sx={{
                  minWidth: 96,
                  borderRadius: '10px',
                  px: 3,
                  py: 1.45,
                  bgcolor: '#1A1A1A',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#0f0f10',
                    boxShadow: 'none',
                  },
                }}
              >
                {secondaryLabel}
              </Button>
            </Stack>

            <IconButton
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
              sx={{
                display: { xs: 'inline-flex', lg: 'none' },
                border: '1px solid #eff2f7',
                borderRadius: '12px',
                color: '#1A1A1A',
              }}
            >
              {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </IconButton>
          </Stack>
        </Stack>

        <Collapse in={mobileOpen} timeout={220} unmountOnExit>
          <Stack spacing={1.1} sx={{ pb: 2.2 }}>
            {links.map((item) => {
              const isHash = item.to.startsWith('#')

              return (
                <Box
                  key={`mobile-${item.label}-${item.to}`}
                  component={isHash ? 'a' : RouterLink}
                  href={isHash ? item.to : undefined}
                  to={isHash ? undefined : item.to}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    px: 1,
                    py: 0.75,
                    color: '#1A1A1A',
                    fontSize: '0.96rem',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Box>
              )
            })}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ pt: 0.8 }}>
              <Button
                component={RouterLink}
                to={primaryTo}
                onClick={() => setMobileOpen(false)}
                variant="contained"
                sx={{
                  flex: 1,
                  borderRadius: '10px',
                  py: 1.3,
                  bgcolor: '#FF6600',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#e85b00',
                    boxShadow: 'none',
                  },
                }}
              >
                {primaryLabel}
              </Button>
              <Button
                component={RouterLink}
                to={secondaryTo}
                onClick={() => setMobileOpen(false)}
                variant="contained"
                sx={{
                  flex: 1,
                  borderRadius: '10px',
                  py: 1.3,
                  bgcolor: '#1A1A1A',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#0f0f10',
                    boxShadow: 'none',
                  },
                }}
              >
                {secondaryLabel}
              </Button>
            </Stack>

            <Typography sx={{ pt: 0.3, color: '#8492A6', fontSize: '0.84rem', lineHeight: 1.7 }}>
              One stop for all your shipping and seller operations.
            </Typography>
          </Stack>
        </Collapse>
      </Container>
    </Box>
  )
}
