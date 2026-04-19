import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import {
  FiChevronDown,
  FiEye,
  FiImage,
  FiPlus,
  FiSave,
  FiUploadCloud,
} from 'react-icons/fi'
import { brand } from '../../theme/brand'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 42,
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.82rem',
    '& fieldset': { borderColor: '#e6eaef' },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.82rem',
    py: 1.1,
  },
}

const sectionCardSx = {
  background: '#fff',
  border: '1px solid #ece9f1',
  borderRadius: '14px',
  boxShadow: 'none',
}

const uploadCardSx = {
  border: '1px dashed #d8dce3',
  borderRadius: '14px',
  minHeight: 172,
  display: 'grid',
  placeItems: 'center',
  background: '#fbfcfd',
  transition: 'all 180ms ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: brand.accent,
    background: '#fff8f2',
  },
}

const themeOptions = [{ label: 'Theme 1', image: '/reference/parcelx-login-bg.png' }]

const socialFields = [
  'Instagram',
  'Facebook',
  'YouTube',
  'LinkedIn',
  'WhatsApp',
  'Twitter',
]

export default function OrderTrackingForm() {
  const [selectedTheme, setSelectedTheme] = useState('Theme 1')
  const [trackingChoices, setTrackingChoices] = useState<string[]>([])

  const toggleChoice = (value: string) => {
    setTrackingChoices((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  return (
    <Box sx={{ p: '18px 18px 28px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Box sx={{ ...sectionCardSx, p: '16px 18px 18px' }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', lg: 'center' }}
            spacing={1.25}
          >
            <Typography sx={{ fontSize: '1.28rem', fontWeight: 600, color: '#232b34' }}>
              Custom Tracking Page
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                startIcon={<FiEye size={16} />}
                sx={{
                  minHeight: 40,
                  px: 1.8,
                  borderRadius: '8px',
                  border: '1px solid #ece9f1',
                  color: '#27303f',
                  background: '#fff',
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                Preview
              </Button>
              <Button
                startIcon={<FiSave size={16} />}
                sx={{
                  minHeight: 40,
                  px: 1.9,
                  borderRadius: '8px',
                  background: brand.accent,
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}
              >
                Submit
              </Button>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(12, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>Subdomain</Typography>
              <TextField fullWidth placeholder="Enter your subdomain" sx={fieldSx} />
            </Box>
            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>Domain</Typography>
              <TextField
                select
                fullWidth
                value="trackorder.live"
                sx={fieldSx}
                SelectProps={{ IconComponent: FiChevronDown }}
              >
                <MenuItem value="trackorder.live">trackorder.live</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ gridColumn: { md: 'span 4' }, display: 'flex', alignItems: 'flex-end' }}>
              <Button
                sx={{
                  minHeight: 42,
                  px: 2.1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px dashed #cfd5de',
                  color: '#27303f',
                  background: '#fff',
                }}
              >
                Check Availability
              </Button>
            </Box>

            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>Website Title</Typography>
              <TextField fullWidth placeholder="Enter Website Title" sx={fieldSx} />
            </Box>
            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>Website URL</Typography>
              <TextField fullWidth placeholder="Enter Website URL" sx={fieldSx} />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#232b34', mb: 1.1 }}>
              Website Theme
            </Typography>
            <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
              {themeOptions.map((theme) => {
                const active = selectedTheme === theme.label
                return (
                  <Box
                    key={theme.label}
                    onClick={() => setSelectedTheme(theme.label)}
                    sx={{
                      width: 154,
                      borderRadius: '12px',
                      border: active ? `2px solid ${brand.accent}` : '1px solid #ece9f1',
                      overflow: 'hidden',
                      background: '#fff',
                      cursor: 'pointer',
                      transition: 'all 180ms ease',
                    }}
                  >
                    <Box
                      component="img"
                      src={theme.image}
                      alt={theme.label}
                      sx={{ width: '100%', height: 92, objectFit: 'cover', display: 'block' }}
                    />
                    <Typography sx={{ px: 1.2, py: 1, fontSize: '0.76rem', fontWeight: 600 }}>
                      {theme.label}
                    </Typography>
                  </Box>
                )
              })}
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.75 }}>
                Display Logo (png, jpg, jpeg) <span style={{ color: brand.accent }}>*</span>
              </Typography>
              <Box sx={uploadCardSx}>
                <Stack alignItems="center" spacing={0.8}>
                  <FiImage size={42} color="#7d8896" />
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#2d3748' }}>
                    Upload or Drop Image
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.75 }}>
                Display Banner (png, jpg, jpeg) <span style={{ color: brand.accent }}>*</span>
              </Typography>
              <Box sx={uploadCardSx}>
                <Stack alignItems="center" spacing={0.8}>
                  <FiUploadCloud size={42} color="#7d8896" />
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#2d3748' }}>
                    Upload or Drop Image
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>

          <Box sx={{ pt: 0.5 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
            >
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#232b34' }}>
                Header Menus
              </Typography>
              <Button
                startIcon={<FiPlus size={16} />}
                sx={{
                  minHeight: 38,
                  px: 1.65,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid #ece9f1',
                  color: '#27303f',
                  background: '#fff',
                }}
              >
                Add Menu
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#232b34', mb: 0.75 }}>
              Notification Feed
            </Typography>
            <TextField multiline minRows={4} fullWidth placeholder="Enter Notification Feed" sx={fieldSx} />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(12, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>Youtube Video Link</Typography>
              <TextField fullWidth placeholder="Enter Youtube Link" sx={fieldSx} />
            </Box>
            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>Support Phone Number</Typography>
              <TextField fullWidth placeholder="Enter Phone Number" sx={fieldSx} />
            </Box>
            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>Support Email</Typography>
              <TextField fullWidth placeholder="Enter Support Email" sx={fieldSx} />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#232b34', mb: 0.65 }}>
              Track Your Choice:
            </Typography>
            <Stack direction="row" spacing={2.2} flexWrap="wrap" useFlexGap>
              {['Waybill Number', 'Channel Order ID', 'Mobile Number'].map((choice) => (
                <Box key={choice} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={trackingChoices.includes(choice)}
                    onChange={() => toggleChoice(choice)}
                    sx={{ p: 0.5, mr: 0.8 }}
                  />
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: '#2f3946' }}>
                    {choice}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#232b34', mb: 1.1 }}>
              Add Social Links
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              {socialFields.map((field) => (
                <Box key={field}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.55 }}>{field}</Typography>
                  <TextField
                    fullWidth
                    placeholder={`Enter ${field} ${field === 'WhatsApp' ? 'Number' : 'Link'}`}
                    sx={fieldSx}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ pt: 0.4 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
            >
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#232b34', visibility: 'hidden' }}>
                Products
              </Typography>
              <Button
                startIcon={<FiPlus size={16} />}
                sx={{
                  minHeight: 38,
                  px: 1.65,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid #ece9f1',
                  color: '#27303f',
                  background: '#fff',
                }}
              >
                Add Product
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
