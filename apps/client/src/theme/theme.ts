import { alpha, createTheme } from '@mui/material/styles'
import { brand, brandFonts, brandGradients } from './brand'

export const BRAND_NAVY = brand.ink
export const BRAND_PLUM = brand.ink
export const BRAND_YELLOW = brand.gold
export const BRAND_BLUE = brand.sky
export const TEXT = brand.inkSoft
export const BRAND_LIGHT_NAVY = alpha(brand.ink, 0.12)
export const BRAND_PURPLE = brand.ink

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 300,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    background: {
      default: brand.page,
      paper: brand.surface,
    },
    primary: {
      main: brand.accent,
      light: '#FF8B3D',
      dark: '#E85B00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brand.ink,
      light: '#3B3531',
      dark: '#100D0B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: brand.danger,
      light: '#FCA5A5',
      dark: '#991B1B',
    },
    warning: {
      main: brand.warning,
      light: '#FDE7C5',
      dark: '#B45309',
    },
    info: {
      main: '#60A5FA',
      light: '#D4F6FF',
      dark: '#1D4ED8',
    },
    success: {
      main: brand.success,
      light: '#D6F5EC',
      dark: '#1F7F68',
    },
    text: {
      primary: brand.ink,
      secondary: brand.inkSoft,
      disabled: alpha(brand.inkSoft, 0.58),
    },
    divider: alpha(brand.ink, 0.08),
  },
    shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: brandFonts.body,
    h1: {
      fontFamily: brandFonts.display,
      color: brand.ink,
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.02,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: brandFonts.display,
      color: brand.ink,
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.06,
      letterSpacing: '-0.04em',
    },
    h3: {
      fontFamily: brandFonts.display,
      color: brand.ink,
      fontWeight: 700,
      fontSize: '1.7rem',
      lineHeight: 1.12,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontFamily: brandFonts.display,
      color: brand.ink,
      fontWeight: 700,
      fontSize: '1.45rem',
      lineHeight: 1.18,
    },
    h5: {
      fontFamily: brandFonts.display,
      color: brand.ink,
      fontWeight: 700,
      fontSize: '1.16rem',
      lineHeight: 1.2,
    },
    h6: {
      fontFamily: brandFonts.display,
      color: brand.ink,
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.24,
    },
    subtitle1: {
      color: brand.ink,
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle2: {
      color: brand.inkSoft,
      fontWeight: 600,
      fontSize: '0.82rem',
      letterSpacing: '0.01em',
    },
    body1: {
      color: brand.ink,
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.68,
    },
    body2: {
      color: brand.inkSoft,
      fontWeight: 400,
      fontSize: '0.92rem',
      lineHeight: 1.65,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: brandGradients.page,
          backgroundRepeat: 'no-repeat',
          color: brand.ink,
          fontFamily: brandFonts.body,
        },
        '#root': {
          minHeight: '100vh',
        },
        '::selection': {
          backgroundColor: alpha(brand.sky, 0.92),
          color: brand.ink,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 16,
          boxShadow: brand.shadow,
          border: `1px solid ${alpha(brand.line, 0.96)}`,
          background: '#FFFFFF',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          flexGrow: 1,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: brand.shadow,
        },
        elevation4: {
          boxShadow: brand.shadow,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 18px',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: 'none',
          cursor: 'pointer',
          transition:
            'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, border-color 160ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.985)',
          },
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            transform: 'none',
          },
        },
        containedPrimary: {
          background: brandGradients.button,
          color: '#FFFFFF',
          boxShadow: '0 10px 24px rgba(255, 102, 0, 0.24)',
          '&:hover': {
            background: brandGradients.button,
            boxShadow: '0 14px 30px rgba(255, 102, 0, 0.3)',
          },
        },
        containedSecondary: {
          backgroundColor: brand.ink,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#163E59',
          },
        },
        outlined: {
          borderColor: alpha(brand.line, 1),
          color: brand.ink,
          backgroundColor: '#FFFFFF',
          '&:hover': {
            borderColor: alpha(brand.accent, 0.45),
            backgroundColor: '#FFFFFF',
          },
        },
        text: {
          color: brand.ink,
          '&:hover': {
            backgroundColor: alpha(brand.accent, 0.06),
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&.Mui-disabled': {
            cursor: 'not-allowed',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition:
            'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, opacity 160ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.96)',
          },
          '&.Mui-disabled': {
            transform: 'none',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          transition:
            'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, border-color 160ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.985)',
          },
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            transform: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: alpha(brand.line, 1),
            },
            '&:hover fieldset': {
              borderColor: alpha(brand.accent, 0.4),
            },
            '&.Mui-focused fieldset': {
              borderColor: brand.accent,
            },
          },
          '& .MuiInputLabel-root': {
            color: brand.inkSoft,
            fontWeight: 500,
            '&.Mui-focused': {
              color: brand.accent,
            },
          },
          '& .MuiOutlinedInput-input': {
            color: brand.ink,
            paddingTop: 10,
            paddingBottom: 10,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
        filled: {
          backgroundColor: alpha(brand.accent, 0.08),
          color: brand.accent,
        },
        outlined: {
          borderColor: alpha(brand.line, 1),
          color: brand.ink,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${alpha(brand.line, 1)}`,
          boxShadow: '0 18px 48px rgba(23, 19, 16, 0.12)',
          background: '#FFFFFF',
          overflow: 'hidden',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: brand.ink,
          fontFamily: brandFonts.display,
          fontWeight: 700,
          fontSize: '1.06rem',
          padding: '18px 20px 10px',
          borderBottom: `1px solid ${alpha(brand.line, 1)}`,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '14px 20px',
          borderTop: `1px solid ${alpha(brand.line, 1)}`,
          backgroundColor: '#FFFFFF',
          gap: 10,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(brand.ink, 0.36),
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: alpha(brand.accent, 0.06),
          color: brand.ink,
          fontWeight: 700,
          borderBottom: `1px solid ${alpha(brand.line, 1)}`,
        },
        root: {
          borderBottom: `1px solid ${alpha(brand.line, 1)}`,
          color: brand.ink,
        },
      },
    },
  },
})

export default theme
