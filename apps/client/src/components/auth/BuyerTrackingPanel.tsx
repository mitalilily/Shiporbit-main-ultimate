import { Box, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLogo from '../brand/BrandLogo'
import CustomIconLoadingButton from '../UI/button/CustomLoadingButton'
import CustomInput from '../UI/inputs/CustomInput'
import { toast } from '../UI/Toast'
import { brand } from '../../theme/brand'

export default function BuyerTrackingPanel() {
  const navigate = useNavigate()
  const [waybillNumber, setWaybillNumber] = useState('')
  const [issue, setIssue] = useState('')

  const handleTrack = () => {
    if (!waybillNumber.trim()) {
      toast.open({
        message: 'Enter the waybill number to continue.',
        severity: 'warning',
      })
      return
    }

    navigate(`/tracking?awb=${encodeURIComponent(waybillNumber.trim())}`)
  }

  return (
    <Stack spacing={2.2} className="shiporbit-auth-form-card">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.4 }}>
        <BrandLogo sx={{ width: { xs: 152, sm: 180 } }} />
      </Box>

      <CustomInput
        label="Waybill Number"
        placeholder="Enter Waybill Number"
        value={waybillNumber}
        onChange={(event) => setWaybillNumber(event.target.value)}
        topMargin={false}
      />

      <Box sx={{ mt: 0.3 }}>
        <Typography
          sx={{
            mb: 0.6,
            fontSize: '0.92rem',
            fontWeight: 600,
            color: brand.ink,
          }}
        >
          Report Your Issue (If Any)
        </Typography>
        <TextField
          multiline
          minRows={4}
          fullWidth
          placeholder="Tell us what happened with your shipment"
          value={issue}
          onChange={(event) => setIssue(event.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: 'rgba(21,59,255,0.12)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(21,59,255,0.24)',
              },
              '&.Mui-focused fieldset': {
                borderColor: brand.sky,
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '0.92rem',
              lineHeight: 1.6,
            },
          }}
        />
      </Box>

      <CustomIconLoadingButton
        text="Track your shipment"
        onClick={handleTrack}
        styles={{
          width: '100%',
          minHeight: 48,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #153bff 0%, #3f79ff 100%)',
          boxShadow: '0 14px 28px rgba(21,59,255,0.22)',
        }}
      />
    </Stack>
  )
}
