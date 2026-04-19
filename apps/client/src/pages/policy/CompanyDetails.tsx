import { Box, Link, Typography } from '@mui/material'
import supportBoxIcon from '../../assets/support/parcel-box.jpg'

const supportCards = [
  {
    title: 'Helpline Team',
    phone: '+91-9311936818',
    phoneHref: 'tel:+919311936818',
    email: 'help@parcelx.in',
    emailHref: 'mailto:help@parcelx.in',
  },
  {
    title: 'Pickup Team',
    phone: '+91-9811399452',
    phoneHref: 'tel:+919811399452',
    email: 'pickups@parcelx.in',
    emailHref: 'mailto:pickups@parcelx.in',
  },
  {
    title: 'Weight Team',
    email: 'weight@parcelx.in',
    emailHref: 'mailto:weight@parcelx.in',
  },
  {
    title: 'Finance Team',
    email: 'finance@parcelx.in',
    emailHref: 'mailto:finance@parcelx.in',
  },
]

export default function CompanyDetails() {
  return (
    <Box sx={{ p: '18px 18px 28px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Box sx={{ background: '#fff', border: '1px solid #ece9f1', borderRadius: '14px', p: '18px 18px 22px' }}>
        <Box className="top____heading d-block" sx={{ mb: 2.25 }}>
          <Typography sx={{ fontSize: '1.42rem', fontWeight: 700, color: '#20262d', mb: 0.8 }}>
            Need Help? We’re Here for You
          </Typography>
          <Typography sx={{ fontSize: '0.92rem', color: '#5d6775', lineHeight: 1.65 }}>
            Reach out to our support team and we’ll make sure you get the assistance you need.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
            gap: 1.5,
          }}
        >
          {supportCards.map((card) => (
            <Box
              key={card.title}
              sx={{
                borderRadius: '18px',
                border: '1px solid #ece9f1',
                background: 'linear-gradient(180deg, #ffffff 0%, #fffaf6 100%)',
                overflow: 'hidden',
                minHeight: 206,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ p: '18px 18px 14px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      background: '#fff3ea',
                      display: 'grid',
                      placeItems: 'center',
                      border: '1px solid #ffe1cc',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={supportBoxIcon}
                      alt={card.title}
                      sx={{ width: 30, height: 30, objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#ff6600' }}>
                    {card.title}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderTop: '1px solid #f1e4da', p: '14px 18px 16px', display: 'grid', gap: 1 }}>
                {card.phone ? (
                  <Link
                    href={card.phoneHref}
                    underline="none"
                    sx={{
                      color: '#20262d',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <span>📞</span>
                    {card.phone}
                  </Link>
                ) : null}

                {card.phone && card.email ? (
                  <Box sx={{ width: '100%', height: 1, background: '#f1e4da' }} />
                ) : null}

                <Link
                  href={card.emailHref}
                  underline="none"
                  sx={{
                    color: '#20262d',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    wordBreak: 'break-word',
                  }}
                >
                  <span>✉</span>
                  {card.email}
                </Link>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
