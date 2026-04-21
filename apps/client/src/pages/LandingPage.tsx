import { alpha, Box, Button, Container, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCalendar, FiClock, FiGlobe, FiLogIn, FiRefreshCcw, FiZap } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import PublicFooter from '../components/public/PublicFooter'
import PublicNavbar from '../components/public/PublicNavbar'

const palette = {
  ink: '#1A1A1A',
  muted: '#8492A6',
  surface: '#FFFFFF',
  section: '#FAFBFE',
  line: '#EFF2F7',
  orange: '#FF6600',
  blueA: '#1F31FF',
  blueB: '#3558FF',
  blueC: '#3E97FF',
}

const navLinks = [
  { label: 'Home', to: '/landing' },
  { label: 'About', to: '#about' },
  { label: 'Features', to: '#features' },
  { label: 'Pricing', to: '#pricing' },
  { label: 'Our Partners', to: '#partners' },
  { label: 'PaceX', to: '#pacex' },
  { label: 'Videsh', to: '#videsh' },
  { label: 'Tracking', to: '/tracking' },
  { label: 'Career', to: '#career' },
  { label: 'Contact', to: '#contact' },
]

const featureCards = [
  {
    title: 'One roof solution for all your logistic needs',
    text: 'The moment you think to ship via ShipOrbit, your dashboard will be created within 20 minutes with no dashboard fee or subscription charges.',
    icon: '/reference/icons/feature-logistics.svg',
  },
  {
    title: 'Zero dashboard fee / monthly charges',
    text: 'The moment you think to ship via ShipOrbit, your dashboard will be created within 20 minutes with no dashboard fee or subscription charges.',
    icon: '/reference/icons/feature-money.svg',
  },
  {
    title: 'Shipping cost customisation',
    text: 'AI tools help in choosing the courier partner based on pincode, product type, weight, and end customer requirement.',
    icon: '/reference/icons/feature-customization.svg',
  },
  {
    title: 'Dedicated account manager',
    text: 'A dedicated account manager will be assigned to resolve all your shipping grievances and queries and help you build a loyal customer chain.',
    icon: '/reference/icons/feature-manager.svg',
  },
  {
    title: 'Automated shipping process',
    text: 'A three step automated shipping process will help you save time, cost, and energy through channel integration, labels, and tracking.',
    icon: '/reference/icons/feature-automation.svg',
  },
  {
    title: 'Remittances and invoices',
    text: 'Timely remitting the COD in your bank account and unified transparent billing will help you analyse cash flow and profit margins simultaneously.',
    icon: '/reference/icons/feature-remittance.svg',
  },
]

const steps = [
  {
    step: 'Step 01',
    title: 'Connecting your integration channel',
    text: 'Push orders via API with Shopify, Magento, etc. or place single and bulk orders over the ShipOrbit dashboard.',
    image: '/reference/steps/step-api.png',
    tone: 'primary',
  },
  {
    step: 'Step 02',
    title: 'Fetch shipping labels',
    text: 'Print customised size labels and an auto pickup request will be generated simultaneously.',
    image: '/reference/steps/step-print.png',
    tone: 'dark',
  },
  {
    step: 'Step 03',
    title: 'Track your shipment',
    text: 'Once the shipments are picked, you can track shipments in real time and raise delivery exceptions.',
    image: '/reference/steps/step-track.png',
    tone: 'primary',
  },
  {
    step: 'Step 04',
    title: 'Customer experience / feedback',
    text: 'Amplify your brand, increase your repeated customers, and gain customer loyalty with ShipOrbit.',
    image: '/reference/steps/step-feedback.png',
    tone: 'dark',
  },
] as const

const stats = [
  { value: '5K+', label: 'Happy Clients' },
  { value: '1000K+', label: 'Monthly Shipments' },
  { value: '29K+', label: 'Serviceable pincodes' },
  { value: '150+', label: 'Countries Served' },
]

const testimonials = [
  {
    name: 'Dev Rathi',
    company: 'Webliska',
    text: 'After looking out at a number of other logistic players, we zeroed over ShipOrbit. Speedy COD settlement has volunteered me to refer my business partners.',
  },
  {
    name: 'Rajni',
    company: 'TheTstore9',
    text: "ShipOrbit's platform is embedded with some smart tools which helps me in cutting down manpower and energy focusing on business and revenue.",
  },
  {
    name: 'Gagandeep Singh',
    company: 'The Wood Home',
    text: 'ShipOrbit data analysis engine gave me a deep insight about my audience. Consequently I changed my strategies and increased my profit margins.',
  },
]

const services = [
  { title: 'Express', icon: <FiZap size={24} /> },
  { title: 'Next day', icon: <FiClock size={24} /> },
  { title: 'Appointment', icon: <FiCalendar size={24} /> },
  { title: 'International', icon: <FiGlobe size={24} /> },
  { title: 'Reverse', icon: <FiRefreshCcw size={24} /> },
  { title: 'Hyperlocal', icon: <FiArrowRight size={24} /> },
]

const logos = [
  '/logo/integrations/shopify.webp',
  '/logo/integrations/woocommerce.webp',
  '/logo/integrations/amazon.png',
  '/logo/integrations/magento.png',
  '/logo/integrations/delhivery.png',
  '/logo/integrations/dtdc.png',
  '/logo/integrations/ekart.png',
  '/logo/integrations/xpressbees.png',
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </Box>
  )
}

function SectionLead({
  title,
  description,
  light = false,
}: {
  title: string
  description: string
  light?: boolean
}) {
  return (
    <Stack spacing={1.7} sx={{ mb: 5, textAlign: 'center', alignItems: 'center' }}>
      <Typography
        sx={{
          color: light ? '#FFFFFF' : palette.ink,
          fontSize: { xs: '1.9rem', md: '2.2rem' },
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          maxWidth: 860,
          color: light ? alpha('#FFFFFF', 0.88) : palette.muted,
          fontSize: '1.125rem',
          fontWeight: 300,
          lineHeight: 1.8,
        }}
      >
        {description}
      </Typography>
    </Stack>
  )
}

export default function LandingPage() {
  return (
    <Box className="site-shell" sx={{ bgcolor: palette.surface }}>
      <Box
        sx={{
          display: 'block',
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #eff2f7',
          py: { xs: 0.9, md: 1.05 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: palette.ink, fontSize: { xs: '0.82rem', md: '0.92rem' }, fontWeight: 500, lineHeight: 1.6 }}>
          Recharge with ₹500 &amp; get <Box component="span" sx={{ color: palette.orange, fontWeight: 700 }}>₹250 bonus</Box> credits. Start shipping smarter today with <Box component="span" sx={{ color: palette.orange, fontWeight: 700 }}>ShipOrbit</Box>.
        </Typography>
      </Box>

      <PublicNavbar links={navLinks} />

      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: palette.section }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: { xs: 'block', xl: 'none' },
            background: `linear-gradient(135deg, ${palette.blueA} 0%, ${palette.blueB} 42%, ${palette.blueC} 100%)`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '-40%',
            left: '-1rem',
            width: '130%',
            height: '124%',
            transform: 'rotate(-7deg)',
            borderBottomLeftRadius: '3rem',
            zIndex: 0,
            display: { xs: 'none', xl: 'block' },
            backgroundImage:
              "linear-gradient(135deg, rgba(31,49,255,0.96) 0%, rgba(53,88,255,0.98) 45%, rgba(62,151,255,0.96) 100%), url('/reference/parcelx-ellipse.png')",
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
        <Box
          component="img"
          src="/reference/parcelx-hero-bg.svg"
          alt=""
          aria-hidden="true"
          sx={{
            position: 'absolute',
            right: { lg: -120, xl: -60 },
            top: { lg: 40, xl: 0 },
            width: { lg: 520, xl: 680 },
            opacity: 0.45,
            display: { xs: 'none', lg: 'block' },
            zIndex: 0,
          }}
        />
        <Box
          component="img"
          src="/reference/parcelx-hero-illustration.png"
          alt="ShipOrbit shipping dashboard illustration"
          sx={{
            position: 'absolute',
            right: { lg: 24, xl: 56 },
            top: { lg: 132, xl: 96 },
            width: { lg: 600, xl: 760 },
            maxWidth: '52vw',
            display: { xs: 'none', lg: 'block' },
            zIndex: 1,
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 2,
            minHeight: { lg: 760 },
            py: { xs: 7, md: 9, lg: 11, xl: 12 },
            px: { xs: 2, sm: 3, lg: 4 },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Reveal>
            <Box sx={{ maxWidth: { xs: '100%', lg: 540, xl: 620 } }}>
              <Typography sx={{ color: '#FFFFFF', mb: 3, lineHeight: 1.18 }}>
                <Box component="span" sx={{ display: 'block', fontSize: { xs: '2.2rem', sm: '2.65rem', md: '3.5rem' }, fontWeight: 300 }}>
                  Shipping is now
                </Box>
                <Box component="span" sx={{ display: 'block', fontSize: { xs: '2.2rem', sm: '2.65rem', md: '3.5rem' }, fontWeight: 300 }}>
                  smarter & easier
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 300,
                  lineHeight: { xs: 1.75, md: 1.85 },
                  maxWidth: 620,
                }}
              >
                ShipOrbit uses AI-based platform to make shipping easier than ever before. With our
                unique tech platform, you can manage your end-to-end shipping needs with just a few
                clicks. Our system automatically streamlines your shipping process with a single
                window for multiple carriers and saves your time and costs.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  endIcon={<FiArrowRight size={16} />}
                  sx={{
                    alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    borderRadius: '999px',
                    px: 4,
                    py: 1.6,
                    bgcolor: '#FFFFFF',
                    color: '#273444',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#ececec',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  startIcon={<FiLogIn size={16} />}
                  sx={{
                    alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    borderRadius: '999px',
                    px: 4,
                    py: 1.6,
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      bgcolor: '#FFFFFF',
                      color: '#273444',
                    },
                  }}
                >
                  Login Now
                </Button>
              </Stack>

              <Box
                component="img"
                src="/reference/parcelx-hero-illustration.png"
                alt="ShipOrbit shipping interface"
                sx={{
                  display: { xs: 'block', lg: 'none' },
                  width: '100%',
                  maxWidth: 560,
                  mt: 5,
                }}
              />
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Box component="section" id="pricing" sx={{ bgcolor: palette.section, py: { xs: 7, md: 9 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Reveal>
            <SectionLead
              title="Small Business Parcel Delivery From Rs-24*"
              description="We pick up and deliver across India and around the world in low, flat-rates. It's simple, reliable and affordable."
            />
          </Reveal>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 3,
            }}
          >
            {featureCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.04}>
                <Box
                  sx={{
                    minHeight: '100%',
                    bgcolor: '#FFFFFF',
                    border: `1px solid ${palette.line}`,
                    borderRadius: '14px',
                    px: 3,
                    py: 3.25,
                    textAlign: 'center',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 1rem 3rem rgba(31, 45, 61, 0.125)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={card.icon}
                    alt=""
                    aria-hidden="true"
                    sx={{ height: 70, width: 70, objectFit: 'contain', mb: 3 }}
                  />
                  <Typography sx={{ color: palette.ink, fontSize: '1.18rem', fontWeight: 600, lineHeight: 1.45 }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ mt: 1.3, color: palette.muted, lineHeight: 1.8 }}>
                    {card.text}
                  </Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" id="features" sx={{ bgcolor: '#FFFFFF', py: { xs: 7, md: 9 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Reveal>
            <SectionLead
              title="How ShipOrbit Works?"
              description="4 simple steps to make your shipping experience amazing."
            />
          </Reveal>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              gap: 3,
            }}
          >
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05}>
                <Box
                  sx={{
                    minHeight: '100%',
                    borderRadius: '18px',
                    px: 3,
                    py: 4,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    background:
                      step.tone === 'primary'
                        ? `linear-gradient(135deg, ${palette.blueA} 0%, ${palette.blueB} 58%, ${palette.blueC} 100%)`
                        : '#1A1A1A',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 1rem 3rem rgba(31, 45, 61, 0.125)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={step.image}
                    alt=""
                    aria-hidden="true"
                    sx={{ height: 72, width: 'auto', mb: 1.8 }}
                  />
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 1 }}>
                    {step.step}
                  </Typography>
                  <Typography sx={{ fontSize: '1.32rem', fontWeight: 600, lineHeight: 1.35 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ mt: 1.3, lineHeight: 1.8, color: alpha('#FFFFFF', 0.9) }}>
                    {step.text}
                  </Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        id="videsh"
        sx={{
          py: { xs: 7, md: 8 },
          background: `linear-gradient(135deg, ${palette.blueA} 0%, ${palette.blueB} 55%, ${palette.blueC} 100%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Reveal>
            <Stack spacing={1.3} sx={{ mb: 5, textAlign: 'center', alignItems: 'center' }}>
              <Typography
                sx={{
                  color: alpha('#FFFFFF', 0.86),
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Our process
              </Typography>
              <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '1.9rem', md: '2.2rem' }, fontWeight: 600 }}>
                Just a few numbers
              </Typography>
            </Stack>
          </Reveal>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
              gap: 3,
            }}
          >
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.04}>
                <Box sx={{ textAlign: 'center', color: '#FFFFFF' }}>
                  <Typography sx={{ fontSize: { xs: '2rem', md: '2.4rem' }, fontWeight: 700, lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ mt: 1.2, color: alpha('#FFFFFF', 0.88), fontSize: '1rem' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" id="about" sx={{ bgcolor: '#FFFFFF', py: { xs: 7, md: 9 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={{ xs: 4, lg: 8 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Reveal>
              <Box sx={{ width: '100%', maxWidth: 560 }}>
                <Typography
                  sx={{
                    color: palette.orange,
                    fontSize: { xs: '1.7rem', md: '2rem' },
                    fontWeight: 700,
                    lineHeight: 1.35,
                  }}
                >
                  Seamless Logistics for Your E-Commerce Growth
                </Typography>
                <Typography sx={{ mt: 3, color: palette.muted, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.9 }}>
                  Effortlessly manage your e-commerce shipping with our reliable logistics
                  solutions. From order fulfillment to last-mile delivery, we handle everything to
                  ensure fast, secure, and cost-effective shipping across multiple channels. Scale
                  your business with hassle-free logistics today.
                </Typography>
              </Box>
            </Reveal>

            <Reveal delay={0.08}>
              <Box
                component="img"
                src="/reference/parcelx-logistics-growth.png"
                alt="Logistics growth illustration"
                loading="lazy"
                sx={{ width: '100%', maxWidth: 640, display: 'block' }}
              />
            </Reveal>
          </Stack>
        </Container>
      </Box>

      <Box component="section" id="partners" sx={{ bgcolor: palette.section, py: { xs: 7, md: 9 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Reveal>
            <SectionLead
              title="Flexible Shipping APIs for any online merchant"
              description="ShipOrbit's shipping APIs provide end-to-end flexibility and more control over parcel shipping and logistics processes for ecommerce retailers, marketplaces, enterprises, fulfillment centers and more."
            />
          </Reveal>

          <Reveal delay={0.06}>
            <Box
              sx={{
                borderRadius: '24px',
                border: `1px solid ${palette.line}`,
                bgcolor: '#FFFFFF',
                p: { xs: 2, md: 4 },
                boxShadow: '0 16px 36px rgba(31, 45, 61, 0.06)',
              }}
            >
              <Box
                component="img"
                src="/reference/parcelx-api-network.png"
                alt="Shipping API ecosystem illustration"
                loading="lazy"
                sx={{ width: '100%', display: 'block' }}
              />
            </Box>
          </Reveal>

          <Box
            sx={{
              mt: 4,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {logos.map((logo, index) => (
              <Reveal key={logo} delay={index * 0.03}>
                <Box
                  sx={{
                    height: 92,
                    borderRadius: '14px',
                    border: `1px solid ${palette.line}`,
                    bgcolor: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    p: 2,
                  }}
                >
                  <Box component="img" src={logo} alt="Partner logo" loading="lazy" sx={{ maxWidth: '100%', maxHeight: 44 }} />
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" id="career" sx={{ bgcolor: palette.section, py: { xs: 7, md: 9 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Reveal>
            <SectionLead
              title="Customer Stories"
              description="Thousands of Indian businesses are using ShipOrbit and expanded their reach to their customers in no time."
            />
          </Reveal>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
              gap: 3,
            }}
          >
            {testimonials.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.05}>
                <Box
                  sx={{
                    minHeight: '100%',
                    borderRadius: '18px',
                    border: `1px solid ${palette.line}`,
                    bgcolor: '#FFFFFF',
                    p: 3,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '999px',
                        bgcolor: alpha(palette.orange, 0.14),
                        color: palette.orange,
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                      }}
                    >
                      {item.name.charAt(0)}
                    </Box>
                    <Box>
                      <Typography sx={{ color: palette.ink, fontWeight: 600 }}>{item.name}</Typography>
                      <Typography sx={{ color: palette.muted, fontSize: '0.92rem' }}>{item.company}</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ mt: 3, color: palette.muted, lineHeight: 1.85 }}>{item.text}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        id="pacex"
        sx={{
          py: { xs: 7, md: 8 },
          background: `linear-gradient(135deg, ${palette.blueA} 0%, ${palette.blueB} 55%, ${palette.blueC} 100%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Reveal>
            <SectionLead
              title="Services We Offer"
              description="Different types of services are available based on your customer requirement."
              light
            />
          </Reveal>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 3,
            }}
          >
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.04}>
                <Stack
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    minHeight: { xs: 148, sm: 180 },
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.16)',
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '18px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'rgba(255,255,255,0.14)',
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{service.title}</Typography>
                </Stack>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ bgcolor: '#FFFFFF', py: { xs: 7, md: 9 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Reveal>
            <SectionLead
              title="Clients who are using our Superpowers"
              description="A huge number of brands have gained their customer loyalty using ShipOrbit."
            />
          </Reveal>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
              gap: 2.2,
            }}
          >
            {logos.map((logo, index) => (
              <Reveal key={`client-${logo}`} delay={index * 0.03}>
                <Box
                  sx={{
                    height: { xs: 88, sm: 104 },
                    borderRadius: '14px',
                    border: `1px solid ${palette.line}`,
                    bgcolor: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    p: 2.2,
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 14px 30px rgba(31, 45, 61, 0.08)',
                    },
                  }}
                >
                  <Box component="img" src={logo} alt="Client logo" loading="lazy" sx={{ maxWidth: '100%', maxHeight: 42 }} />
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <PublicFooter />
    </Box>
  )
}
