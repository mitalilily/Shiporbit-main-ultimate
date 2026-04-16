import { Box, Button, Stack, Typography } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { MdOutlineFileUpload } from 'react-icons/md'
import BrandLogo from '../brand/BrandLogo'
import CustomInput from '../UI/inputs/CustomInput'
import { toast } from '../UI/Toast'
import { useRequestOtp } from '../../hooks/useOTP'
import { extractInlineCode } from './inlineCode'
import AuthCodePreview from './AuthCodePreview'
import { brand } from '../../theme/brand'

type UploadKey = 'aadharFront' | 'aadharBack' | 'pan' | 'gst' | 'cancelledCheque'

const uploadLabels: Array<{ key: UploadKey; label: string; required?: boolean }> = [
  { key: 'aadharFront', label: 'Upload your Aadhar (Front)', required: true },
  { key: 'aadharBack', label: 'Upload your Aadhar (Back)', required: true },
  { key: 'pan', label: 'Upload your Pan Image' },
  { key: 'gst', label: 'Upload your GST' },
  { key: 'cancelledCheque', label: 'Upload your cancelled cheque' },
]

export default function SellerSignupPanel() {
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState(sessionStorage.getItem('activeEmail') ?? '')
  const [inlineOtp, setInlineOtp] = useState('')
  const [files, setFiles] = useState<Partial<Record<UploadKey, File>>>({})
  const inputRefs = useRef<Partial<Record<UploadKey, HTMLInputElement | null>>>({})

  const { mutate: requestOtp, isPending: requestingEmailOtp } = useRequestOtp()

  const emailError = useMemo(() => {
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.'
    return ''
  }, [email])

  const phoneError = useMemo(() => {
    if (!phoneNumber.trim()) return 'Phone number is required.'
    if (!/^\d{10}$/.test(phoneNumber.trim())) return 'Enter a valid 10-digit phone number.'
    return ''
  }, [phoneNumber])

  const handleEmailOtp = () => {
    if (emailError) {
      toast.open({
        message: emailError,
        severity: 'warning',
      })
      return
    }

    requestOtp(email.trim().toLowerCase(), {
      onSuccess: (response: any) => {
        const code = extractInlineCode(response)
        setInlineOtp(code)
        sessionStorage.setItem('activeEmail', email.trim().toLowerCase())
        toast.open({
          message: code
            ? 'Email OTP generated. Use the inline preview below.'
            : 'Email OTP sent successfully.',
          severity: 'success',
        })
      },
      onError: () => {
        toast.open({
          message: 'Unable to send email OTP right now.',
          severity: 'error',
        })
      },
    })
  }

  const handlePhoneOtp = () => {
    if (phoneError) {
      toast.open({
        message: phoneError,
        severity: 'warning',
      })
      return
    }

    toast.open({
      message: 'Phone OTP UI is ready, but the backend phone OTP service is not configured yet.',
      severity: 'info',
    })
  }

  return (
    <Stack spacing={2.2} className="shiporbit-auth-form-card">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.4 }}>
        <BrandLogo sx={{ width: { xs: 152, sm: 180 } }} />
      </Box>

      <CustomInput
        label="Full Name"
        placeholder="Enter Full Name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        topMargin={false}
      />

      <CustomInput
        label="Business Name"
        placeholder="Enter Business Name"
        value={businessName}
        onChange={(event) => setBusinessName(event.target.value)}
      />

      <Box className="shiporbit-auth-inline-field">
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Phone Number"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 10))}
            helperText={phoneNumber ? phoneError : ''}
            error={Boolean(phoneNumber) && Boolean(phoneError)}
          />
        </Box>
        <Button
          type="button"
          variant="contained"
          onClick={handlePhoneOtp}
          sx={uploadButtonSx}
        >
          Get OTP
        </Button>
      </Box>

      <Box className="shiporbit-auth-inline-field">
        <Box sx={{ flex: 1 }}>
          <CustomInput
            label="Email"
            placeholder="Enter Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            helperText={email ? emailError : ''}
            error={Boolean(email) && Boolean(emailError)}
          />
        </Box>
        <Button
          type="button"
          variant="contained"
          onClick={handleEmailOtp}
          disabled={requestingEmailOtp}
          sx={uploadButtonSx}
        >
          Get OTP
        </Button>
      </Box>

      {inlineOtp ? (
        <Box className="shiporbit-auth-subcard">
          <AuthCodePreview
            title="Inline Email OTP"
            code={inlineOtp}
            helper="Use this preview during development when inline OTP exposure is enabled."
          />
        </Box>
      ) : null}

      <Stack spacing={1.15}>
        {uploadLabels.map((field) => (
          <Box key={field.key} className="shiporbit-upload-row">
            <Box sx={{ minWidth: 0 }}>
              <Typography className="shiporbit-upload-label">
                {field.label} {field.required ? '*' : ''}
              </Typography>
              <Typography className="shiporbit-upload-name">
                {files[field.key]?.name || 'No file selected'}
              </Typography>
            </Box>
            <input
              ref={(node) => {
                inputRefs.current[field.key] = node
              }}
              type="file"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setFiles((current) => ({ ...current, [field.key]: file }))
              }}
            />
            <Button
              type="button"
              variant="outlined"
              startIcon={<MdOutlineFileUpload size={18} />}
              onClick={() => inputRefs.current[field.key]?.click()}
              sx={uploadButtonSx}
            >
              Upload file
            </Button>
          </Box>
        ))}
      </Stack>

      <Typography sx={{ color: brand.inkSoft, textAlign: 'center', fontSize: '0.88rem' }}>
        Already have an account?{' '}
        <Box component={RouterLink} to="/login" sx={{ color: brand.accent, fontWeight: 700 }}>
          Sign In
        </Box>
      </Typography>
    </Stack>
  )
}

const uploadButtonSx = {
  minWidth: 116,
  height: 44,
  alignSelf: 'flex-end',
  borderRadius: '12px',
  px: 2.1,
  textTransform: 'none',
  fontWeight: 800,
  boxShadow: 'none',
  borderColor: 'rgba(21,59,255,0.18)',
  color: '#153bff',
  backgroundColor: '#ffffff',
  '&.MuiButton-contained': {
    background: 'linear-gradient(135deg, #153bff 0%, #3f79ff 100%)',
    color: '#ffffff',
  },
}
