import { Button, CircularProgress, Typography, alpha, type ButtonProps } from '@mui/material'
import React from 'react'
import { brand, brandGradients } from '../../../theme/brand'

type ButtonVisualVariant = 'solid' | 'text'

interface CustomIconLoadingButtonProps
  extends Omit<ButtonProps, 'color' | 'type' | 'disabled' | 'onClick' | 'variant'> {
  text: string
  icon?: React.ReactNode
  loading?: boolean
  onClick?: () => void
  disabled?: boolean
  loadingText?: string
  type?: 'button' | 'submit' | 'reset'
  styles?: Record<string, unknown>
  variant?: ButtonVisualVariant
  textColor?: string
}

export default function CustomIconLoadingButton({
  text,
  icon,
  loading = false,
  onClick,
  disabled = false,
  loadingText = 'Loading...',
  type = 'button',
  styles,
  textColor,
  variant = 'solid',
  ...rest
}: CustomIconLoadingButtonProps) {
  const isDisabled = loading || disabled

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      sx={{
        ...styles,
        px: 3,
        py: 1.1,
        textTransform: 'none',
        fontWeight: 600,
        gap: 1,
        borderRadius: 10,
        background: variant === 'solid' ? brandGradients.button : '#FFFFFF',
        color: textColor ?? (variant === 'solid' ? '#FFFFFF' : brand.ink),
        border:
          variant === 'text'
            ? `1px solid ${alpha(brand.line, 1)}`
            : '1px solid transparent',
        boxShadow:
          variant === 'solid'
            ? '0 10px 24px rgba(255,102,0,0.22)'
            : 'none',
        '&:hover': {
          background:
            variant === 'solid'
              ? brandGradients.button
              : alpha(brand.accent, 0.04),
        },
        '&:disabled': {
          opacity: 0.58,
          cursor: 'not-allowed',
          background: variant === 'solid' ? brandGradients.button : '#FFFFFF',
          color: textColor ?? alpha(brand.ink, 0.62),
          borderColor: variant === 'text' ? alpha(brand.line, 1) : 'transparent',
        },
      }}
      {...rest}
    >
      {loading ? (
        <>
          <CircularProgress size={16} thickness={4} sx={{ color: 'currentColor' }} />
          <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 700 }}>
            {loadingText}
          </Typography>
        </>
      ) : (
        <>
          {icon}
          <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 700 }}>
            {text}
          </Typography>
        </>
      )}
    </Button>
  )
}
