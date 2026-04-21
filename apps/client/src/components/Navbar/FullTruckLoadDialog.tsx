import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { FiTruck, FiX } from 'react-icons/fi'

interface FullTruckLoadDialogProps {
  open: boolean
  onClose: () => void
}

type FieldErrors = {
  name?: string
  phone?: string
}

const initialValues = {
  name: '',
  phone: '',
}

export default function FullTruckLoadDialog({ open, onClose }: FullTruckLoadDialogProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) {
      setValues(initialValues)
      setErrors({})
      setSubmitted(false)
    }
  }, [open])

  const handleChange = (field: 'name' | 'phone', nextValue: string) => {
    const sanitizedValue =
      field === 'phone' ? nextValue.replace(/\D/g, '').slice(0, 10) : nextValue.slice(0, 50)

    setValues((current) => ({
      ...current,
      [field]: sanitizedValue,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Please enter your name.'
    }

    if (!values.phone.trim()) {
      nextErrors.phone = 'Please enter your phone number.'
    } else if (values.phone.trim().length !== 10) {
      nextErrors.phone = 'Phone number must be 10 digits.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitted(true)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative' }}>
        <IconButton
          aria-label="Close full truck load dialog"
          onClick={onClose}
          sx={{ position: 'absolute', top: 14, right: 14 }}
        >
          <FiX size={18} />
        </IconButton>

        <Stack component="form" spacing={2.2} onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 102, 0, 0.12)',
                color: '#ff6600',
              }}
            >
              <FiTruck size={22} />
            </Box>
            <Typography variant="h5" sx={{ fontSize: '1.2rem', fontWeight: 700, pr: 4 }}>
              Submit Your Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              <strong>Note:</strong> FTL is when a single customer&apos;s goods fill up the entire
              vehicle, and the shipment is delivered directly from the origin to the destination
              without intermediate stops or transfers.
            </Typography>
          </Stack>

          {submitted ? (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              Your FTL request has been captured. Our sales team will contact you shortly.
            </Alert>
          ) : null}

          <TextField
            label="Name"
            placeholder="Enter your name"
            value={values.name}
            onChange={(event) => handleChange('name', event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            inputProps={{ maxLength: 50 }}
            required
            fullWidth
          />

          <TextField
            label="Phone"
            placeholder="Enter your phone number"
            value={values.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            inputProps={{ maxLength: 10, inputMode: 'numeric' }}
            required
            fullWidth
          />

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: -0.4 }}>
            Once the FTL form is submitted, our sales team will contact you.
          </Typography>

          <Stack direction="row" spacing={1.2} justifyContent="flex-end" sx={{ pt: 0.5 }}>
            <Button type="button" variant="text" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
