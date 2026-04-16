import { Box, type BoxProps } from '@mui/material'
import BrandSurface from './BrandSurface'

interface BrandTopBarProps extends BoxProps {
  innerSx?: BoxProps['sx']
}

export default function BrandTopBar({
  children,
  sx,
  innerSx,
  ...rest
}: BrandTopBarProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1, sm: 1.25 },
        ...sx,
      }}
      {...rest}
    >
      <BrandSurface
        variant="card"
        sx={{
          px: { xs: 1.5, sm: 2, lg: 2.5 },
          py: { xs: 1, sm: 1.15 },
          ...innerSx,
        }}
      >
        {children}
      </BrandSurface>
    </Box>
  )
}
