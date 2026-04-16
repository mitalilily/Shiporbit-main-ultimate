import { alpha, Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { brand } from '../../../theme/brand'

interface CustomInputProps extends Omit<TextFieldProps, 'variant' | 'prefix' | 'postfix'> {
  label?: string
  placeholder?: string
  prefix?: React.ReactNode
  postfix?: React.ReactNode
  required?: boolean
  width?: string | number
  helpText?: string
  topMargin?: boolean
  maxLength?: number
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      value,
      onChange,
      type = 'text',
      label = '',
      placeholder = '',
      prefix,
      postfix,
      required = false,
      helperText,
      width = '100%',
      helpText,
      topMargin = true,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const internalRef = useRef<HTMLInputElement>(null)

    const isPasswordType = type === 'password'

    useEffect(() => {
      if (value) setIsFocused(true)
    }, [value])

    return (
      <Box sx={{ mt: topMargin ? 2 : 0, width }}>
        {label && (
          <Typography
            sx={{
              mb: 0.6,
              fontSize: '0.92rem',
              fontWeight: 600,
              letterSpacing: 0,
              color: brand.ink,
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onClick={() => internalRef.current?.focus()}
          >
            {label}
            {required && <Box component="span" sx={{ color: brand.accent }}>*</Box>}
          </Typography>
        )}

        <TextField
          type={isPasswordType && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          helperText={helperText}
          fullWidth
          placeholder={placeholder}
          inputRef={(el) => {
            if (typeof ref === 'function') ref(el)
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
            internalRef.current = el
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (!internalRef.current?.value) setIsFocused(false)
          }}
          sx={{
            width,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              bgcolor: '#FFFFFF',
              boxShadow: isFocused ? '0 0 0 3px rgba(255,102,0,0.12)' : 'none',
              transition: 'all 0.2s ease',
              '& fieldset': {
                borderColor: isFocused ? alpha(brand.accent, 0.5) : alpha(brand.line, 1),
                borderWidth: 1,
              },
              '&:hover fieldset': {
                borderColor: alpha(brand.accent, 0.4),
              },
              '&.Mui-error': {
                boxShadow: '0 0 0 3px rgba(255, 77, 79, 0.08)',
              },
              '&.Mui-error fieldset': {
                borderColor: alpha(brand.danger, 0.4),
              },
              '&.Mui-focused.Mui-error fieldset': {
                borderColor: alpha(brand.danger, 0.5),
              },
            },
            '& .MuiInputBase-input': {
              py: 1,
              color: brand.ink,
              fontWeight: 500,
              fontSize: '0.92rem',
              lineHeight: 1.4,
            },
            '& .MuiFormHelperText-root': {
              ml: 0,
              mt: 0.6,
              fontWeight: 500,
              fontSize: '0.76rem',
            },
          }}
          slotProps={{
            input: {
              startAdornment: prefix ? (
                <InputAdornment position="start">
                  <Box sx={{ display: 'flex', color: isFocused ? brand.ink : alpha(brand.ink, 0.72) }}>
                    {prefix}
                  </Box>
                </InputAdornment>
              ) : undefined,
              endAdornment: (
                <InputAdornment position="end">
                  {isPasswordType ? (
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      sx={{
                        color: isFocused ? brand.accent : brand.inkSoft,
                        '&:hover': { bgcolor: alpha(brand.accent, 0.08) },
                      }}
                    >
                      {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </IconButton>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: alpha(brand.ink, 0.72) }}>
                      {postfix}
                    </Box>
                  )}
                </InputAdornment>
              ),
            },
            htmlInput: {
              maxLength: maxLength ?? 100,
            },
          }}
          {...props}
        />

        {helpText ? (
          <Box sx={{ mt: 0.8, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                color: brand.inkSoft,
                textAlign: 'right',
              }}
            >
              {helpText}
            </Typography>
          </Box>
        ) : null}
      </Box>
    )
  },
)

CustomInput.displayName = 'CustomInput'

export default CustomInput
