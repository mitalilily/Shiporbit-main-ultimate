import {
  alpha,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { BiRupee } from 'react-icons/bi'
import { FiDownload, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import CourierRateCards from '../../components/CourierRateCard'
import B2BRateCalculator from '../../components/tools/B2BRateCalculator'
import B2CRateCalculator from '../../components/tools/B2CRateCalculator'
import CustomIconLoadingButton from '../../components/UI/button/CustomLoadingButton'
import PageHeading from '../../components/UI/heading/PageHeading'
import CustomInput from '../../components/UI/inputs/CustomInput'
import { SmartTabs } from '../../components/UI/tab/Tabs'
import { useAvailableCouriersMutation } from '../../hooks/Integrations/useCouriers'
import { usePaymentOptions } from '../../hooks/usePaymentOptions'
import { usePincodeLookup } from '../../hooks/User/usePincodeLookup'
import { brand } from '../../theme/brand'
import { defaultLogo } from '../../utils/constants'

type ShipmentType = 'b2b' | 'b2c'
const TOOL_ACCENT = brand.accent
const utilityTabs = [
  { label: 'Rate Calculator', path: '/utility/ratecalculator' },
  { label: 'Pincode Servicability', path: '/utility/pincode' },
  { label: 'Rate Card', path: '/utility/ratecard' },
]

const termsAndConditions = {
  b2c: [
    'Above Shared Commercials are Exclusive GST.',
    'Above pricing subject to change based on courier company updation or change in any commercials.',
    'Freight Weight is Picked - Volumetric or Dead weight whichever is higher will be charged.',
    "Return charges as same as Forward for currier's where special RTO pricing is not shared.",
    'Fixed COD charge or COD % of the order value whichever is higher.',
    'Other charges like address correction charges if applicable shall be charged extra.',
    'Prohibited item not to be ship, if any penalty will charge to seller.',
    'No Claim would be entertained for Glassware, Fragile products, Concealed damages and improper packaging.',
    'Any weight dispute due to incorrect weight declaration cannot be claimed.',
    'Chargeable weight would be volumetric or actual weight, whichever is higher (LxBxH/5000).',
    'Delhivery 2 KG, 5 KG & 10 KG accounts have 4000 volumetric divisor.',
    'Liability of Reverse QC check - maximum limit INR 2000 or product value whichever is lower.',
  ],
  b2b: [
    'Above Shared Commercials are Exclusive GST.',
    'Above pricing subject to change based on courier company updation or change in any commercials.',
    'Freight Weight is Picked - Volumetric or Dead weight whichever is higher will be charged.',
    'Other charges like address correction charges if applicable shall be charged extra.',
    'Prohibited item not to be ship, if any penalty will charge to seller.',
    'No Claim would be entertained for Glassware, Fragile products, Concealed damages and improper packaging.',
    'Any weight dispute due to incorrect weight declaration cannot be claimed.',
    'Chargeable weight would be volumetric or actual weight, whichever is higher.',
    'Delhivery: (LxBxH/27000)*CFT',
    {
      text: 'The Transporter Id are as Follows',
      sub: ['Delhivery B2B is 06AAPCS9575E1ZR'],
    },
  ],
}

export const cardStyles = {
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  background: '#FFFFFF',
  border: `1px solid ${alpha(brand.ink, 0.08)}`,
  borderRadius: '22px',
  boxShadow: '0 10px 24px rgba(23,19,16,0.04)',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export function RateCalculator() {
  const location = useLocation()
  const { mutateAsync, isPending, isError, error } = useAvailableCouriersMutation()
  const couriersRef = useRef<HTMLDivElement | null>(null)
  const [shipmentType, setShipmentType] = useState<ShipmentType>('b2c')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [availableCouriers, setAvailableCouriers] = useState<any[]>([])
  const [pincodeCourierType, setPincodeCourierType] = useState('Courier Selection')
  const [pincodeExpressType, setPincodeExpressType] = useState('Surface')
  const [sourcePincode, setSourcePincode] = useState('')
  const [destinationPincode, setDestinationPincode] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pincodeRows, setPincodeRows] = useState<any[]>([])
  const { data: paymentOptions } = usePaymentOptions()

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      pickupPincode: '',
      pickupCity: '',
      pickupState: '',
      deliveryPincode: '',
      deliveryCity: '',
      deliveryState: '',
      paymentType: 'cod',
      length: '',
      breadth: '',
      height: '',
      weight: '',
      totalWeight: '',
      numberOfBoxes: '',
      orderAmount: '',
    },
  })

  const {
    watch,
    setValue,
    setError,
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const pickupPincode = watch('pickupPincode')
  const deliveryPincode = watch('deliveryPincode')
  const isUtilityRoute = location.pathname.startsWith('/utility/')
  const activeUtilityPath =
    utilityTabs.find((tab) => location.pathname === tab.path)?.path || '/utility/ratecalculator'

  const loadingPickup = usePincodeLookup(pickupPincode, 'pickup', setValue, setError, clearErrors)
  const loadingDelivery = usePincodeLookup(
    deliveryPincode,
    'delivery',
    setValue,
    setError,
    clearErrors,
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: any) => {
    try {
      // convert to numbers
      const length = Number(formData.length) || 0
      const breadth = Number(formData.breadth) || 0
      const height = Number(formData.height) || 0
      const actualWeightKg = Number(formData.weight) || 0 // kg from UI

      const volumetricWeightGrams = ((length * breadth * height) / 5000) * 1000
      const actualWeightGrams = actualWeightKg * 1000
      const applicableWeightGrams = Math.max(actualWeightGrams, volumetricWeightGrams, 500)

      const orderAmountValue = Number(formData.orderAmount || 0)

      const payload = {
        pickupPincode: formData.pickupPincode,
        deliveryPincode: formData.deliveryPincode,
        weight: applicableWeightGrams,
        cod: formData.paymentType === 'cod' ? Math.max(orderAmountValue, 1) : 0,
        length,
        breadth,
        height,
        orderAmount: orderAmountValue > 0 ? orderAmountValue : undefined,
        shipmentType: shipmentType,
        payment_type: formData?.paymentType,
        context: 'rate_calculator',
      }

      const result = await mutateAsync(payload)
      setAvailableCouriers(result ?? [])
      console.log('Available couriers:', result)
    } catch (err) {
      setAvailableCouriers([])
      console.error('Failed fetching couriers:', err)
    }
  }

  useEffect(() => {
    if (availableCouriers?.length > 0 && couriersRef.current) {
      couriersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [availableCouriers])

  useEffect(() => {
    setAvailableCouriers([])
  }, [shipmentType])

  const normalizeYesNo = (value: unknown) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'number') return value > 0 ? 'Yes' : 'No'
    if (typeof value === 'string') {
      const normalized = value.toLowerCase()
      if (['true', 'yes', 'y', '1'].includes(normalized)) return 'Yes'
      if (['false', 'no', 'n', '0'].includes(normalized)) return 'No'
      return value
    }
    return 'No'
  }

  const toPincodeTableRows = (rows: unknown[]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows.map((item: any) => ({
      courier: item.displayName || item.name || item.courier_name || '--',
      destination: normalizeYesNo(item.destinationServiceable ?? item.isDestinationServiceable ?? true),
      pickup: normalizeYesNo(item.pickupServiceable ?? item.isPickupServiceable ?? true),
      reverse: normalizeYesNo(item.reverseServiceable ?? item.reverse_available ?? false),
      prepaid: normalizeYesNo(item.prepaidServiceable ?? item.prepaid_available ?? true),
      cod: normalizeYesNo(item.codServiceable ?? item.cod_available ?? false),
      ndd: normalizeYesNo(item.nddServiceable ?? item.ndd_available ?? false),
      zone: item.approxZone?.name || item.approxZone?.code || '--',
    }))

  const onSearchPincodeServiceability = async () => {
    if (!/^[1-9][0-9]{5}$/.test(sourcePincode) || !/^[1-9][0-9]{5}$/.test(destinationPincode)) {
      setPincodeRows([])
      return
    }

    try {
      const result = await mutateAsync({
        pickupPincode: sourcePincode,
        deliveryPincode: destinationPincode,
        weight: 500,
        cod: 0,
        payment_type: 'prepaid',
        isCalculator: false,
      })
      setPincodeRows(toPincodeTableRows(result ?? []))
    } catch {
      setPincodeRows([])
    }
  }

  const onResetPincodeServiceability = () => {
    setPincodeCourierType('Courier Selection')
    setPincodeExpressType('Surface')
    setSourcePincode('')
    setDestinationPincode('')
    setPincodeRows([])
  }

  const onDownloadPincodeRows = () => {
    const csvRows = pincodeRows.map((row) => ({
      Courier: row.courier,
      Destination: row.destination,
      Pickup: row.pickup,
      Reverse: row.reverse,
      Prepaid: row.prepaid,
      COD: row.cod,
      NDD: row.ndd,
      Zone: row.zone,
    }))
    const headers = ['Courier', 'Destination', 'Pickup', 'Reverse', 'Prepaid', 'COD', 'NDD', 'Zone']
    const lines = [headers.join(',')]
    csvRows.forEach((row) => {
      lines.push(
        headers
          .map((header) => `"${String(row[header as keyof typeof row] ?? '').replace(/"/g, '""')}"`)
          .join(','),
      )
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'serviceable_pincodes.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Set default payment type based on enabled options
  useEffect(() => {
    if (paymentOptions) {
      const currentPaymentType = methods.watch('paymentType')
      const isCurrentEnabled =
        (currentPaymentType === 'cod' && paymentOptions.codEnabled) ||
        (currentPaymentType === 'prepaid' && paymentOptions.prepaidEnabled)

      if (!isCurrentEnabled) {
        // Set to first available option
        if (paymentOptions.codEnabled) {
          methods.setValue('paymentType', 'cod')
        } else if (paymentOptions.prepaidEnabled) {
          methods.setValue('paymentType', 'prepaid')
        }
      }
    }
  }, [paymentOptions, methods])

  if (isUtilityRoute) {
    if (activeUtilityPath === '/utility/pincode') {
      return (
        <Stack gap={2.2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.2,
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {utilityTabs.map((tab) => {
                const active = activeUtilityPath === tab.path
                return (
                  <Box
                    key={tab.path}
                    component={NavLink}
                    to={tab.path}
                    sx={{
                      px: 1.8,
                      py: 1,
                      borderRadius: '999px',
                      textDecoration: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: active ? '#FFFFFF' : '#475467',
                      bgcolor: active ? '#121212' : '#f4f6f8',
                      border: '1px solid #e7ebf0',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab.label}
                  </Box>
                )
              })}
            </Box>
            <Button
              onClick={onDownloadPincodeRows}
              startIcon={<FiDownload size={16} />}
              sx={{
                minHeight: 40,
                px: 1.8,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                color: '#20262d',
                border: '1px solid #e7ebf0',
                background: '#fff',
              }}
            >
              Download All serviceable pincode
            </Button>
          </Box>

          <Box
            sx={{
              border: '1px solid #eceff3',
              bgcolor: '#FFFFFF',
              borderRadius: '20px',
              p: { xs: 2, md: 2.5 },
              boxShadow: '0 12px 30px rgba(16, 24, 40, 0.04)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0,1fr))', xl: 'repeat(5, minmax(0,1fr))' },
                gap: 1.35,
                alignItems: 'end',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', mb: 0.65 }}>Select Type</Typography>
                <TextField
                  select
                  value={pincodeCourierType}
                  onChange={(event) => setPincodeCourierType(event.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Courier Selection">Courier Selection</MenuItem>
                </TextField>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', mb: 0.65 }}>Express Type</Typography>
                <TextField
                  select
                  value={pincodeExpressType}
                  onChange={(event) => setPincodeExpressType(event.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Surface">Surface</MenuItem>
                  <MenuItem value="Air">Air</MenuItem>
                </TextField>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', mb: 0.65 }}>Source Pincode</Typography>
                <TextField
                  value={sourcePincode}
                  onChange={(event) => setSourcePincode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter Pincode"
                  fullWidth
                  size="small"
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', mb: 0.65 }}>Destination Pincode</Typography>
                <TextField
                  value={destinationPincode}
                  onChange={(event) => setDestinationPincode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter Pincode"
                  fullWidth
                  size="small"
                />
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  onClick={onSearchPincodeServiceability}
                  startIcon={<FiSearch size={15} />}
                  sx={{
                    minHeight: 40,
                    px: 1.8,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: brand.accent,
                    color: '#fff',
                    '&:hover': { background: '#E75D00' },
                  }}
                >
                  Search
                </Button>
                <Button
                  onClick={onResetPincodeServiceability}
                  startIcon={<FiRefreshCw size={15} />}
                  sx={{
                    minHeight: 40,
                    px: 1.8,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: '1px solid #ece9f1',
                    color: '#27303f',
                    background: '#fff',
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ border: '1px solid #eceff3', borderRadius: '20px', background: '#fff', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#fff' }}>
                    {['Courier', 'Destination', 'Pickup', 'Reverse', 'Prepaid', 'COD', 'NDD', 'Zone'].map((column) => (
                      <TableCell
                        key={column}
                        sx={{
                          py: 1.55,
                          px: 1.8,
                          borderBottom: '1px solid #edf0f4',
                          color: '#2d3748',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          fontFamily: 'Instrument Sans, sans-serif',
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 4, textAlign: 'center', color: '#667085' }}>
                        Loading serviceability...
                      </TableCell>
                    </TableRow>
                  ) : pincodeRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 5, textAlign: 'center', color: '#6e7784', fontSize: '0.88rem' }}>
                        No data
                      </TableCell>
                    </TableRow>
                  ) : (
                    pincodeRows.map((row, index) => (
                      <TableRow key={`${row.courier}-${index}`}>
                        <TableCell>{row.courier}</TableCell>
                        <TableCell>{row.destination}</TableCell>
                        <TableCell>{row.pickup}</TableCell>
                        <TableCell>{row.reverse}</TableCell>
                        <TableCell>{row.prepaid}</TableCell>
                        <TableCell>{row.cod}</TableCell>
                        <TableCell>{row.ndd}</TableCell>
                        <TableCell>{row.zone}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      )
    }

    return (
      <Stack gap={2.4}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {utilityTabs.map((tab) => {
            const active = activeUtilityPath === tab.path
            return (
              <Box
                key={tab.path}
                component={NavLink}
                to={tab.path}
                sx={{
                  px: 1.8,
                  py: 1,
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: active ? '#FFFFFF' : '#475467',
                  bgcolor: active ? '#121212' : '#f4f6f8',
                  border: '1px solid #e7ebf0',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </Box>
            )
          })}
        </Box>

        <Box
          sx={{
            border: '1px solid #eceff3',
            bgcolor: '#FFFFFF',
            borderRadius: '20px',
            p: { xs: 2, md: 2.5 },
            boxShadow: '0 12px 30px rgba(16, 24, 40, 0.04)',
          }}
        >
          <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' },
                  gap: 2,
                  alignItems: 'start',
                }}
              >
                <Box
                  sx={{
                    border: '1px solid #eceff3',
                    borderRadius: '18px',
                    bgcolor: '#fbfbfc',
                    p: 2,
                  }}
                >
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', mb: 1.25 }}>
                    Select Type <Box component="span" sx={{ color: brand.accent }}>*</Box>
                  </Typography>
                  <ToggleButtonGroup
                    value="courier"
                    exclusive
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    <ToggleButton
                      value="courier"
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        px: 1.5,
                        py: 1.1,
                        borderRadius: '12px !important',
                        textTransform: 'none',
                        fontWeight: 700,
                        color: '#FFFFFF !important',
                        bgcolor: '#111111 !important',
                        borderColor: '#111111 !important',
                      }}
                    >
                      Courier <Box component="span" sx={{ ml: 0.5, opacity: 0.88 }}>Selection</Box>
                    </ToggleButton>
                  </ToggleButtonGroup>

                  <CustomIconLoadingButton
                    onClick={handleSubmit(onSubmit)}
                    text="Get Charges"
                    loading={isPending}
                    loadingText="Fetching..."
                    styles={{
                      width: '100%',
                      minHeight: 44,
                      borderRadius: '12px',
                      bgcolor: brand.accent,
                      color: '#ffffff',
                      fontWeight: 800,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#E75D00' },
                    }}
                  />
                </Box>

                <Box>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        label="From *"
                        placeholder="Enter Pincode"
                        fullWidth
                        {...register('pickupPincode', {
                          required: 'Pickup pincode is required',
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: 'Enter valid 6-digit pincode',
                          },
                        })}
                        error={!!errors.pickupPincode}
                        helperText={errors.pickupPincode?.message as string}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        label="To *"
                        placeholder="Enter Pincode"
                        fullWidth
                        {...register('deliveryPincode', {
                          required: 'Delivery pincode is required',
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: 'Enter valid 6-digit pincode',
                          },
                        })}
                        error={!!errors.deliveryPincode}
                        helperText={errors.deliveryPincode?.message as string}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField select label="Express *" fullWidth defaultValue="surface" SelectProps={{ native: true }}>
                        <option value="surface">Surface</option>
                        <option value="air">Air</option>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField select label="Ndd / Sdd" fullWidth defaultValue="" SelectProps={{ native: true }}>
                        <option value="">Select</option>
                        <option value="ndd">NDD</option>
                        <option value="sdd">SDD</option>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Controller
                        name="paymentType"
                        control={methods.control}
                        rules={{ required: 'Please select a payment type' }}
                        render={({ field }) => (
                          <TextField select label="Payment Mode *" fullWidth value={field.value} onChange={field.onChange} SelectProps={{ native: true }}>
                            {(!paymentOptions || paymentOptions.prepaidEnabled) && (
                              <option value="prepaid">Prepaid</option>
                            )}
                            {(!paymentOptions || paymentOptions.codEnabled) && (
                              <option value="cod">COD</option>
                            )}
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="COD Amount"
                        placeholder="Enter Amount"
                        fullWidth
                        disabled={watch('paymentType') !== 'cod'}
                        value={watch('paymentType') === 'cod' ? watch('orderAmount') || '' : ''}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="Invoice Amount *"
                        placeholder="Enter Amount"
                        fullWidth
                        {...register('orderAmount', {
                          required: 'Order amount is required',
                          min: { value: 1, message: 'Order amount must be at least 1' },
                        })}
                        error={!!errors.orderAmount}
                        helperText={errors.orderAmount?.message as string}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="Quantity *"
                        placeholder="Quantity"
                        fullWidth
                        defaultValue="1"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField select label="MPS" fullWidth defaultValue="no" SelectProps={{ native: true }}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="WEIGHT *"
                        placeholder="weight"
                        fullWidth
                        {...register('weight', {
                          required: 'Actual weight is required',
                          min: { value: 0.1, message: 'Weight must be greater than 0' },
                        })}
                        error={!!errors.weight}
                        helperText={errors.weight?.message as string}
                        InputProps={{ endAdornment: <Box component="span">KG</Box> }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="LENGTH *"
                        placeholder="length"
                        fullWidth
                        {...register('length', {
                          required: 'Length is required',
                          min: { value: 1, message: 'Must be greater than 0' },
                        })}
                        error={!!errors.length}
                        helperText={errors.length?.message as string}
                        InputProps={{ endAdornment: <Box component="span">CM</Box> }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="WIDTH *"
                        placeholder="width"
                        fullWidth
                        {...register('breadth', {
                          required: 'Breadth is required',
                          min: { value: 1, message: 'Must be greater than 0' },
                        })}
                        error={!!errors.breadth}
                        helperText={errors.breadth?.message as string}
                        InputProps={{ endAdornment: <Box component="span">CM</Box> }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="HEIGHT *"
                        placeholder="height"
                        fullWidth
                        {...register('height', {
                          required: 'Height is required',
                          min: { value: 1, message: 'Must be greater than 0' },
                        })}
                        error={!!errors.height}
                        helperText={errors.height?.message as string}
                        InputProps={{ endAdornment: <Box component="span">CM</Box> }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </FormProvider>

          <Box
            ref={couriersRef}
            sx={{
              mt: 2.5,
              border: '1px solid #eceff3',
              borderRadius: '18px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 2.2,
                py: 1.6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eceff3',
                bgcolor: '#FFFFFF',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                  Courier Partner
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#667085' }}>
                  Showing {availableCouriers.length} serviceable couriers
                </Typography>
              </Box>
              <TextField select size="small" defaultValue="low_to_high" sx={{ minWidth: 144 }} SelectProps={{ native: true }}>
                <option value="low_to_high">Low to High</option>
                <option value="high_to_low">High to Low</option>
              </TextField>
            </Box>

            <Box sx={{ p: 2 }}>
              {isPending ? (
                <Typography sx={{ color: brand.ink, textAlign: 'center', py: 5 }}>
                  Loading available couriers...
                </Typography>
              ) : isError ? (
                <Typography sx={{ color: brand.danger, textAlign: 'center', py: 5 }}>
                  Failed to fetch couriers: {error?.message ?? 'Unknown error'}
                </Typography>
              ) : availableCouriers.length === 0 ? (
                <Box
                  sx={{
                    minHeight: 280,
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                    color: '#667085',
                    fontSize: '0.92rem',
                  }}
                >
                  No courier partners available for the selected mode.
                </Box>
              ) : (
                <CourierRateCards
                  shipmentType={watch('paymentType')}
                  availableCouriers={availableCouriers}
                  defaultLogo={defaultLogo}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
    )
  }

  return (
    <Stack>
      <PageHeading
        eyebrow="Seller Tools"
        title="Rate Calculator"
        subtitle="Estimate shipping charges, compare courier availability, and review shipment economics in the same ParcelX-style operator workspace."
      />
      <FormProvider {...methods}>
        <CardContent
          sx={{
            ...cardStyles,
            p: { xs: 2, md: 3 },
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: brand.ink }}>
            Compare courier rates before you ship
          </Typography>
          <Typography sx={{ color: brand.inkSoft, mb: 2.2, lineHeight: 1.7, fontSize: '0.92rem' }}>
            Use your existing pricing and courier APIs to compare serviceability, shipping charges,
            and order economics without leaving the operations flow.
          </Typography>

          {/* Tabs */}
          <SmartTabs
            value={shipmentType}
            onChange={(val) => setShipmentType(val)}
            tabs={[
              { label: 'B2C', value: 'b2c' },
              { label: 'B2B', value: 'b2b' },
            ]}
          />

          <Divider sx={{ my: 2 }} />

          {/* Pickup Section */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Pickup Pincode"
                {...register('pickupPincode', {
                  required: 'Pickup pincode is required',
                  pattern: {
                    value: /^[1-9][0-9]{5}$/,
                    message: 'Enter valid 6-digit pincode',
                  },
                })}
                error={!!errors.pickupPincode}
                helperText={errors.pickupPincode?.message as string}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Pickup City"
                {...register('pickupCity')}
                fullWidth
                disabled
                postfix={loadingPickup ? <CircularProgress size={16} /> : null}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Pickup State"
                {...register('pickupState')}
                fullWidth
                disabled
                postfix={loadingPickup ? <CircularProgress size={16} /> : null}
              />
            </Grid>

            {/* Delivery Section */}
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Delivery Pincode"
                {...register('deliveryPincode', {
                  required: 'Delivery pincode is required',
                  pattern: {
                    value: /^[1-9][0-9]{5}$/,
                    message: 'Enter valid 6-digit pincode',
                  },
                })}
                error={!!errors.deliveryPincode}
                helperText={errors.deliveryPincode?.message as string}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Delivery City"
                {...register('deliveryCity')}
                fullWidth
                disabled
                postfix={loadingDelivery ? <CircularProgress size={16} /> : null}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Delivery State"
                {...register('deliveryState')}
                fullWidth
                disabled
                postfix={loadingDelivery ? <CircularProgress size={16} /> : null}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Conditional Forms */}
          {shipmentType === 'b2c' ? <B2CRateCalculator /> : <B2BRateCalculator />}

          <Divider sx={{ my: 2 }} />
          <Controller
            name="paymentType"
            control={methods?.control}
            rules={{ required: 'Please select a payment type' }}
            render={({ field, fieldState }) => (
              <Stack mb={3}>
                <Typography sx={{ fontSize: '0.9rem', color: brand.inkSoft, fontWeight: 600 }}>
                  Payment Type
                </Typography>
                <Stack direction={'column'} mt={2}>
                  <ToggleButtonGroup
                    value={field.value}
                    exclusive
                    onChange={(_, newValue) => {
                      if (newValue !== null) field.onChange(newValue)
                    }}
                    sx={{ flexWrap: 'wrap', gap: 1 }}
                  >
                    {(!paymentOptions || paymentOptions.prepaidEnabled) && (
                      <ToggleButton
                        value="prepaid"
                        sx={{
                          px: 3,
                          py: 1,
                          borderRadius: '10px !important',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          color: brand.inkSoft,
                          border: `1px solid ${alpha(brand.ink, 0.1)}`,
                          transition: 'all 0.25s ease',
                          '&.Mui-selected': {
                            background: TOOL_ACCENT,
                            color: '#FFFFFF',
                          },
                          '&:hover': {
                            borderColor: TOOL_ACCENT,
                            color: brand.ink,
                          },
                        }}
                      >
                        Prepaid
                      </ToggleButton>
                    )}

                    {(!paymentOptions || paymentOptions.codEnabled) && (
                      <ToggleButton
                        value="cod"
                        sx={{
                          px: 3,
                          py: 1,
                          borderRadius: '10px !important',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          color: brand.inkSoft,
                          border: `1px solid ${alpha(brand.ink, 0.1)}`,
                          transition: 'all 0.25s ease',
                          '&.Mui-selected': {
                            background: TOOL_ACCENT,
                            color: '#FFFFFF',
                          },
                          '&:hover': {
                            borderColor: TOOL_ACCENT,
                            color: brand.ink,
                          },
                        }}
                      >
                        COD
                      </ToggleButton>
                    )}
                  </ToggleButtonGroup>

                  {fieldState?.error && (
                    <p className="text-red-500 text-sm mt-2">{fieldState.error.message}</p>
                  )}
                </Stack>
              </Stack>
            )}
          />

          <Divider sx={{ my: 2 }} />

          <Grid size={{ xs: 12, md: 4 }}>
            <CustomInput
              label="Order Amount (Shipment Value)"
              type="number"
              placeholder="Enter Shipment Value"
              {...register('orderAmount', {
                required: 'Order amount is required',
                min: { value: 1, message: 'Order amount must be at least 1' },
              })}
              error={!!errors.orderAmount}
              helperText={errors.orderAmount?.message as string}
              fullWidth
              prefix={<BiRupee />}
            />
          </Grid>
          <Divider sx={{ my: 2 }} />

          <CustomIconLoadingButton
            onClick={handleSubmit(onSubmit)}
            text="Calculate Shipping Rate"
            loading={isPending}
            loadingText="Calculating..."
            styles={{
              py: 1.5,
              borderRadius: '10px',
              bgcolor: TOOL_ACCENT,
              color: '#ffffff',
              fontWeight: 800,
              boxShadow: `0 10px 24px ${alpha(TOOL_ACCENT, 0.28)}`,
              '&:hover': { bgcolor: '#E75D00' },
            }}
          />
        </CardContent>
      </FormProvider>
      {isPending && (
        <Typography sx={{ color: brand.ink, textAlign: 'center', py: 2 }}>
          Loading available couriers...
        </Typography>
      )}

      {isError ? (
        <Typography sx={{ color: brand.danger, textAlign: 'center', py: 2 }}>
          Failed to fetch couriers: {error?.message ?? 'Unknown error'}
        </Typography>
      ) : (
        <CourierRateCards
          shipmentType={watch('paymentType')}
          availableCouriers={availableCouriers}
          defaultLogo={defaultLogo}
        />
      )}

      <Divider sx={{ my: 3 }} />
      <CardContent
        sx={{
          mt: 3,
          ...cardStyles,
          p: { xs: 2, md: 3 },
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: brand.ink, fontWeight: 700 }}>
          Terms & Conditions ({shipmentType.toUpperCase()})
        </Typography>

        <Stack spacing={1}>
          {termsAndConditions[shipmentType].map((term, idx) => {
            if (typeof term === 'string') {
              return (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6 }}
                >
                  • {term}
                </Typography>
              )
            }

            // If it’s an object with sub-items
            return (
              <Stack key={idx} spacing={0.5}>
                <Typography
                  variant="body2"
                  sx={{ color: '#333369', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 600 }}
                >
                  • {term.text}
                </Typography>
                <Stack pl={3} spacing={0.3}>
                  {term.sub.map((subItem, subIdx) => (
                    <Typography
                      key={subIdx}
                      variant="body2"
                      sx={{ color: '#6B7280', fontSize: '0.8rem', lineHeight: 1.5 }}
                    >
                      ◦ {subItem}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      </CardContent>
    </Stack>
  )
}
