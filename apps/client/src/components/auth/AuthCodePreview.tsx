import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { FiCommand } from 'react-icons/fi'
import BrandSurface from '../brand/BrandSurface'
import { brand } from '../../theme/brand'

interface AuthCodePreviewProps {
  title: string
  code: string
  helper?: string
}

export default function AuthCodePreview({ title, code, helper }: AuthCodePreviewProps) {
  if (!code) return null

  return (
    <BrandSurface
      variant="soft"
      sx={{
        p: 1.25,
        borderRadius: '12px',
        border: `1px solid ${alpha(brand.warning, 0.22)}`,
        background: 'linear-gradient(180deg, rgba(255,248,239,0.96) 0%, rgba(255,255,255,0.98) 100%)',
      }}
    >
      <Stack spacing={0.9}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '10px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(brand.warning, 0.16),
              color: brand.ink,
            }}
          >
            <FiCommand size={15} />
          </Box>
          <Box>
            <Typography sx={{ color: brand.ink, fontWeight: 700, lineHeight: 1.15, fontSize: '0.92rem' }}>
              {title}
            </Typography>
            <Typography sx={{ color: brand.inkSoft, fontSize: '0.74rem' }}>
              Inline preview for console and development auth flows
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            px: 1.2,
            py: 1,
            borderRadius: '10px',
            bgcolor: alpha('#FFFFFF', 0.8),
            border: `1px dashed ${alpha(brand.ink, 0.18)}`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              color: brand.ink,
              fontSize: { xs: '1rem', sm: '1.12rem' },
              letterSpacing: '0.28em',
              textAlign: 'center',
              pl: '0.28em',
            }}
          >
            {code}
          </Typography>
        </Box>

        {helper ? (
          <Typography sx={{ color: brand.inkSoft, fontSize: '0.76rem', lineHeight: 1.6 }}>
            {helper}
          </Typography>
        ) : null}
      </Stack>
    </BrandSurface>
  )
}
