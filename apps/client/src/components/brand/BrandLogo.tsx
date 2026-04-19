import { Box, type BoxProps } from '@mui/material'

interface BrandLogoProps extends Omit<BoxProps, 'component'> {
  compact?: boolean
}

export default function BrandLogo({ compact = false, sx, ...rest }: BrandLogoProps) {
  return (
    <Box
      component="img"
      src="/logo/shiporbit-logo.jpeg"
      alt="ShipOrbit"
      sx={{
        width: compact ? 52 : { xs: 156, sm: 182 },
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
        ...sx,
      }}
      {...rest}
    />
  )
}
