import { Box, Container, Stack, Typography } from '@mui/material'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'
import BrandLogo from '../brand/BrandLogo'

const quickLinks = [
  { label: 'Features', to: '/landing#features' },
  { label: 'Pricing', to: '/landing#pricing' },
  { label: 'About', to: '/landing#about' },
  { label: 'Contact', to: '/landing#contact' },
]

const usefulLinks = [
  { label: 'Partners', to: '/landing#partners' },
  { label: 'Tracking', to: '/tracking' },
  { label: 'Privacy Policy', to: '/policies/privacy_policy' },
  { label: 'Terms & Conditions', to: '/policies/terms_of_service' },
  { label: 'Refund & Cancellation Policy', to: '/policies/refund_cancellation' },
  { label: 'Data protection', to: '/policies/privacy_policy' },
  { label: 'Compliance', to: '/support/about_us' },
]

const socialLinks = [
  { label: 'YouTube', href: 'https://www.youtube.com/@ParcelX', icon: <FaYoutube size={16} /> },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/p/Parcel-X-100065408592406/',
    icon: <FaFacebookF size={16} />,
  },
  { label: 'Instagram', href: 'https://www.instagram.com/parcelx.in/', icon: <FaInstagram size={16} /> },
  { label: 'LinkedIn', href: 'https://in.linkedin.com/company/parcel-x', icon: <FaLinkedinIn size={16} /> },
]

export default function PublicFooter() {
  return (
    <Box component="footer" id="contact" sx={{ px: { xs: 2, md: 3 }, pb: 4.5, pt: 3 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            borderRadius: '24px',
            backgroundImage: 'url(/reference/parcelx-footer-bg.png)',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
            p: { xs: 3, md: '64px 32px 0 55px' },
            overflow: 'hidden',
          }}
        >
          <Stack spacing={{ xs: 4, md: 5 }}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={{ xs: 3, lg: 6 }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', lg: 'stretch' }}
            >
              <Box sx={{ maxWidth: 490 }}>
                <RouterLink to="/landing" aria-label="ShipOrbit home">
                  <BrandLogo sx={{ width: { xs: 156, sm: 176 } }} />
                </RouterLink>
                <Typography sx={{ mt: 2.2, color: '#000000', fontSize: '1rem', lineHeight: 2.1 }}>
                  ShipOrbit offers AI-based smoother, easier and reliable platform to manage your
                  end to end shipping needs for your business.
                </Typography>
              </Box>

              <Stack spacing={3} sx={{ width: '100%', maxWidth: 620 }}>
                <Stack
                  direction="row"
                  justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}
                  spacing={3}
                  flexWrap="wrap"
                  useFlexGap
                >
                  {socialLinks.map((item) => (
                    <Box
                      key={item.label}
                      component="a"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '999px',
                        border: '1px solid #FFCCAA',
                        color: '#1A1A1A',
                        display: 'grid',
                        placeItems: 'center',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          bgcolor: '#FF6600',
                          color: '#F5F5F9',
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                  ))}
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 8, lg: 12.5 }}
                  justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}
                >
                  {[
                    { title: 'Quick Links', items: quickLinks },
                    { title: 'Useful Links', items: usefulLinks },
                  ].map((group) => (
                    <Box key={group.title}>
                      <Typography
                        sx={{
                          color: '#FF6600',
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          lineHeight: 1,
                          letterSpacing: '0.06em',
                          mb: 2.25,
                        }}
                      >
                        {group.title}
                      </Typography>
                      <Stack spacing={1.35}>
                        {group.items.map((item) => (
                          <Box
                            key={item.label}
                            component={item.to.includes('#') ? 'a' : RouterLink}
                            href={item.to.includes('#') ? item.to : undefined}
                            to={item.to.includes('#') ? undefined : item.to}
                            sx={{
                              color: '#1A1A1A',
                              fontSize: '1rem',
                              fontWeight: 400,
                              lineHeight: 1,
                              '&:hover': {
                                color: '#FF6600',
                              },
                            }}
                          >
                            {item.label}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            <Typography
              sx={{
                textAlign: 'center',
                color: '#1A1A1A',
                fontSize: '0.92rem',
                pb: 1.1,
              }}
            >
              SHIPORBIT © Copyright {new Date().getFullYear()}, All Rights Reserved
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
