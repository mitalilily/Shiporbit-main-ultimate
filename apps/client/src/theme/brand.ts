import { alpha } from '@mui/material/styles'

export const brand = {
  ink: '#1A1A1A',
  inkSoft: '#7C7D84',
  page: '#FBFBFB',
  cream: '#FFFFFF',
  sky: '#F2F6FF',
  aqua: '#EFF2F7',
  accent: '#FF6600',
  gold: '#FFAB00',
  line: '#EFF2F7',
  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255,255,255,0.94)',
  success: '#36B37E',
  warning: '#FFAB00',
  danger: '#FF5630',
  shadow: '0 10px 24px rgba(0, 0, 0, 0.04)',
}

export const brandFonts = {
  body: '"Epilogue", "Instrument Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
  display: '"Epilogue", "Instrument Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
}

export const brandGradients = {
  page: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFE 100%)',
  button: 'linear-gradient(180deg, #FF7A1A 0%, #FF6600 100%)',
  hero: `
    linear-gradient(135deg, rgba(31,49,255,0.96) 0%, rgba(53,88,255,0.98) 52%, rgba(62,151,255,0.96) 100%)
  `,
  surface: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
  softSurface: 'linear-gradient(180deg, #FAFBFE 0%, #FFFFFF 100%)',
  analytics: 'linear-gradient(180deg, rgba(250,251,254,1) 0%, rgba(255,255,255,1) 100%)',
}

export const brandEffects = {
  ring: `0 0 0 3px ${alpha(brand.accent, 0.16)}`,
  border: `1px solid ${alpha(brand.line, 0.96)}`,
  focusBorder: `1px solid ${alpha(brand.accent, 0.5)}`,
  mutedBorder: `1px solid ${alpha(brand.ink, 0.08)}`,
}
