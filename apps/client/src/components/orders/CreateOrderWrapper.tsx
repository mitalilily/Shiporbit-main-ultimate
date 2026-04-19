import {
  alpha,
  Box,
  Button,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import {
  FiHome,
  FiMapPin,
  FiPackage,
  FiPlus,
  FiPlusCircle,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from 'react-icons/fi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { fetchLocations } from '../../api/locations'
import type { CreateShipmentParams } from '../../api/order.service'
import { useCreateShipment } from '../../hooks/Orders/useOrders'
import { brand } from '../../theme/brand'
import { toast } from '../UI/Toast'

const sectionCardSx = {
  bgcolor: '#FFFFFF',
  border: '1px solid #ece9f1',
  borderRadius: '12px',
  boxShadow: 'none',
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#FFFFFF',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.84rem',
    minHeight: 40,
    '& fieldset': { borderColor: '#e8ebec' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.82rem',
    color: '#262626',
    fontWeight: 500,
  },
}

const topModes = [
  { label: 'Forward', mode: 'forward', path: '/addorders/forward/AddOrder' },
  { label: 'Reverse', mode: 'reverse', path: '/addorders/reverse/SinglePickup' },
]

const forwardTabs = [
  { label: 'Single Order', path: '/addorders/forward/AddOrder' },
  { label: 'Bulk Order', path: '/addorders/forward/BulkOrder' },
]

const reverseTabs = [
  { label: 'Single Pickup', path: '/addorders/reverse/SinglePickup' },
  { label: 'Quick Pickup', path: '/addorders/reverse/QuickPickup' },
]

const stepIcons = [<FiMapPin />, <FiUser />, <FiShoppingBag />, <FiTruck />, <FiPackage />]

const stepTitles = [
  'Warehouse Address',
  'Where are you sending it?',
  'Product Details',
  'Order Details',
  'Package Details',
]

const warehouseCards = [
  { label: 'Pickup', title: 'Please Select A Pickup Address.', subtitle: 'No address available' },
  { label: 'Return', title: 'Please Select A Return Address.', subtitle: 'No address available' },
]

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

type PickupOption = {
  id: string
  label: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
}

type ProductDraft = {
  productName: string
  quantity: string
  value: string
  sku: string
  hsn: string
  category: string
}

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Typography
    sx={{
      fontFamily: 'Instrument Sans, sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#2f343c',
      mb: 1,
    }}
  >
    {children}
  </Typography>
)

export default function CreateOrderWrapper() {
  const location = useLocation()
  const navigate = useNavigate()
  const createShipmentMutation = useCreateShipment()
  const [pickupOptions, setPickupOptions] = useState<PickupOption[]>([])
  const [pickupLoading, setPickupLoading] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState('Others')
  const [productRows, setProductRows] = useState<ProductDraft[]>([
    { productName: '', quantity: '', value: '', sku: '', hsn: '', category: '' },
  ])
  const [form, setForm] = useState({
    pickupLocation: '',
    returnAddress: false,
    consigneeName: '',
    mobileNumber: '',
    altContact: '',
    email: '',
    address1: '',
    address2: '',
    addressType: 'Home',
    pinCode: '',
    city: '',
    state: '',
    country: 'India',
    invoiceId: '',
    preGeneratedWaybill: '',
    sddNdd: 'No',
    paymentMode: '',
    orderAmount: '0.00',
    gstAmount: '0.00',
    extraCharges: '',
    totalAmount: '0.00',
    codAmount: '0.00',
    mps: 'No',
    actualWeight: '',
    length: '',
    width: '',
    height: '',
    expressType: '',
    sortBy: '',
  })

  const isReverse = location.pathname.includes('/reverse/')
  const isBulkOrder = location.pathname.includes('/forward/BulkOrder')
  const routeTabs = useMemo(() => (isReverse ? reverseTabs : forwardTabs), [isReverse])
  const activeMode = isReverse ? 'reverse' : 'forward'
  const selectedPickup = useMemo(
    () => pickupOptions.find((option) => option.id === form.pickupLocation),
    [pickupOptions, form.pickupLocation],
  )

  const updateField = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))
  const updateProductField = (index: number, key: keyof ProductDraft, value: string) =>
    setProductRows((prev) =>
      prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    )
  const addProductRow = () =>
    setProductRows((prev) => [
      ...prev,
      { productName: '', quantity: '', value: '', sku: '', hsn: '', category: '' },
    ])
  const removeProductRow = (index: number) =>
    setProductRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, rowIndex) => rowIndex !== index)))
  const numeric = (value: string) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  const computedTotal = useMemo(
    () => numeric(form.orderAmount) + numeric(form.gstAmount) + numeric(form.extraCharges),
    [form.orderAmount, form.gstAmount, form.extraCharges],
  )

  useEffect(() => {
    let mounted = true
    const loadPickupLocations = async () => {
      setPickupLoading(true)
      try {
        const result = await fetchLocations({ page: 1, limit: 200 })
        const rawLocations =
          (result?.data?.docs as Array<Record<string, unknown>> | undefined) ||
          (result?.data?.locations as Array<Record<string, unknown>> | undefined) ||
          (result?.data as Array<Record<string, unknown>> | undefined) ||
          (result?.docs as Array<Record<string, unknown>> | undefined) ||
          []
        if (!mounted) return
        const options: PickupOption[] = rawLocations
          .map((entry, index) => ({
            id:
              String(
                entry?._id ||
                  entry?.id ||
                  entry?.pickupLocationId ||
                  entry?.locationId ||
                  `pickup-${index}`,
              ) || `pickup-${index}`,
            label: String(
              entry?.warehouse_name || entry?.warehouseName || entry?.name || entry?.label || '',
            ),
            address: String(entry?.address || entry?.pickupAddress || ''),
            city: String(entry?.city || ''),
            state: String(entry?.state || ''),
            pincode: String(entry?.pincode || entry?.pinCode || ''),
            phone: String(entry?.phone || entry?.mobile || ''),
          }))
          .filter((item) => item.label.trim().length > 0)
        setPickupOptions(options)
      } catch {
        if (mounted) setPickupOptions([])
      } finally {
        if (mounted) setPickupLoading(false)
      }
    }
    void loadPickupLocations()
    return () => {
      mounted = false
    }
  }, [])

  const handleCreateOrder = () => {
    if (isReverse) {
      toast.open({
        message: 'Reverse create flow from this screen is being wired. Please use delivered order reverse flow for now.',
        severity: 'info',
      })
      return
    }

    if (isBulkOrder) {
      toast.open({
        message: 'Bulk order upload flow is under this tab and will be connected in the next step.',
        severity: 'info',
      })
      return
    }

    if (!selectedPickup) {
      toast.open({ message: 'Please select a pickup location.', severity: 'error' })
      return
    }

    if (!form.consigneeName.trim() || !form.mobileNumber.trim() || !form.address1.trim()) {
      toast.open({
        message: 'Consignee Name, Mobile Number and Address Line 1 are required.',
        severity: 'error',
      })
      return
    }

    if (!form.pinCode.trim() || !form.city.trim() || !form.state.trim()) {
      toast.open({ message: 'PIN Code, City and State are required.', severity: 'error' })
      return
    }

    const validProducts = productRows.filter(
      (row) => row.productName.trim().length > 0 && Number(row.quantity || 0) > 0,
    )

    if (!validProducts.length) {
      toast.open({ message: 'Please add valid product details.', severity: 'error' })
      return
    }

    if (!form.paymentMode) {
      toast.open({ message: 'Please select payment mode.', severity: 'error' })
      return
    }

    const payload: CreateShipmentParams = {
      order_number: form.invoiceId.trim() || `SO-${Date.now()}`,
      payment_type: form.paymentMode === 'COD' ? 'cod' : 'prepaid',
      order_date: new Date().toISOString().split('T')[0],
      order_amount: Number(form.orderAmount || 0),
      package_weight: Number(form.actualWeight || 0),
      package_length: Number(form.length || 0),
      package_breadth: Number(form.width || 0),
      package_height: Number(form.height || 0),
      prepaid_amount: computedTotal,
      shipping_charges: Number(form.extraCharges || 0),
      cod_charges: Number(form.codAmount || 0),
      transaction_fee: Number(form.gstAmount || 0),
      consignee: {
        name: form.consigneeName.trim(),
        address: form.address1.trim(),
        address_2: form.address2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pinCode.trim(),
        phone: form.mobileNumber.trim(),
        email: form.email.trim() || undefined,
      },
      pickup_location_id: selectedPickup.id,
      pickup: {
        warehouse_name: selectedPickup.label,
        address: selectedPickup.address || 'NA',
        city: selectedPickup.city || 'NA',
        state: selectedPickup.state || 'NA',
        pincode: selectedPickup.pincode || '000000',
        phone: selectedPickup.phone || '9999999999',
        name: selectedPickup.label,
      },
      is_rto_different: form.returnAddress ? 'yes' : 'no',
      rto: form.returnAddress
        ? {
            warehouse_name: selectedPickup.label,
            name: selectedPickup.label,
            address: selectedPickup.address || 'NA',
            city: selectedPickup.city || 'NA',
            state: selectedPickup.state || 'NA',
            pincode: selectedPickup.pincode || '000000',
            phone: selectedPickup.phone || '9999999999',
          }
        : undefined,
      order_items: validProducts.map((row) => ({
        name: row.productName.trim(),
        sku: row.sku.trim() || 'NA',
        qty: Number(row.quantity || 1),
        price: Number(row.value || 0),
        hsn: row.hsn.trim() || '',
        discount: 0,
        tax_rate: 0,
      })),
    }

    createShipmentMutation.mutate(payload)
  }

  return (
    <Box sx={{ pb: 2, fontFamily: 'Instrument Sans, sans-serif' }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            bgcolor: '#f6f6f6',
            borderRadius: '16px',
            border: '1px solid #ece9f1',
            px: 2,
            py: 1.6,
          }}
        >
          <Stack
            direction={{ xs: 'column', xl: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', xl: 'center' }}
            spacing={1.25}
          >
            <Stack direction="row" alignItems="center" spacing={0.9} flexWrap="wrap" useFlexGap>
              <Typography sx={{ fontSize: '1.45rem', fontWeight: 600, color: '#222', lineHeight: 1 }}>
                Create New Order
              </Typography>
              {topModes.map((tab) => {
                const active = tab.mode === activeMode
                return (
                  <Button
                    key={tab.mode}
                    component={NavLink}
                    to={tab.path}
                    sx={{
                      minWidth: 'auto',
                      px: 0.25,
                      py: 0.25,
                      textTransform: 'none',
                      fontSize: '0.92rem',
                      color: active ? '#111111' : '#666',
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        border: `2px solid ${active ? brand.accent : '#bcc4d0'}`,
                        mr: 0.7,
                        display: 'inline-grid',
                        placeItems: 'center',
                      }}
                    >
                      {active ? <Box sx={{ width: 8, height: 8, borderRadius: 999, bgcolor: brand.accent }} /> : null}
                    </Box>
                    <span>{tab.label}</span>
                  </Button>
                )
              })}
            </Stack>

            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={1}
              alignItems={{ xs: 'flex-start', lg: 'center' }}
              sx={{ width: { xs: '100%', xl: 'auto' } }}
            >
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                {routeTabs.map((tab) => {
                  const active = isPath(location.pathname, tab.path)
                  return (
                    <Button
                      key={tab.path}
                      component={NavLink}
                      to={tab.path}
                      sx={{
                        minHeight: 40,
                        px: 2,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: active ? '#fff' : '#525a66',
                        bgcolor: active ? '#111111' : '#ffffff',
                        border: active ? '1px solid #111111' : '1px solid #eceff4',
                        '&:hover': { bgcolor: active ? '#111111' : '#f8f8f8' },
                      }}
                    >
                      {tab.label}
                    </Button>
                  )
                })}
              </Stack>

              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                <Button
                  onClick={() => navigate('/settings/manage_pickups')}
                  sx={{
                    minHeight: 40,
                    px: 1.5,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#fff',
                    bgcolor: brand.accent,
                  }}
                >
                  <FiHome size={15} style={{ marginRight: 8 }} />
                  Warehouse/Sellers List
                </Button>
                <Button
                  onClick={() => navigate('/settings/manage_pickups')}
                  sx={{
                    minHeight: 40,
                    px: 1.5,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#fff',
                    bgcolor: brand.accent,
                  }}
                >
                  <FiPlus size={15} style={{ marginRight: 8 }} />
                  Add Warehouse
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '1.65fr 0.95fr' },
            gap: 1.25,
            alignItems: 'start',
          }}
        >
          <Box sx={{ bgcolor: '#f6f6f6', borderRadius: '16px', p: 1.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="stretch">
              <Stack spacing={1.1} sx={{ width: 52, pt: 0.15 }}>
                {stepTitles.map((step, index) => (
                  <Stack key={step} alignItems="center" spacing={0.35}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#88919d' }}>Step {index + 1}</Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        border: index === 0 ? `2px solid ${brand.accent}` : '1px solid #d7dde5',
                        color: index === 0 ? brand.accent : '#9aa3af',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 18,
                        bgcolor: '#fff',
                      }}
                    >
                      {stepIcons[index]}
                    </Box>
                    {index < stepTitles.length - 1 ? <Box sx={{ width: 2, height: 64, bgcolor: '#dfdfdf' }} /> : null}
                  </Stack>
                ))}
              </Stack>

              <Stack spacing={1.35} sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ ...sectionCardSx, p: 1.5 }}>
                  <SectionTitle>Warehouse Address</SectionTitle>
                  <Typography sx={{ fontSize: '0.8rem', color: '#8b93a1', mb: 1 }}>Select Your Pickup *</Typography>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ md: 'center' }} mb={1}>
                    <TextField
                      fullWidth
                      select
                      value={form.pickupLocation}
                      onChange={(e) => updateField('pickupLocation', e.target.value)}
                      placeholder="Choose pickup location"
                      sx={fieldSx}
                    >
                      <MenuItem value="">
                        {pickupLoading ? 'Loading pickup locations...' : 'Choose pickup location'}
                      </MenuItem>
                      {pickupOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      onClick={() => updateField('returnAddress', !form.returnAddress)}
                      sx={{
                        minWidth: 'auto',
                        px: 0.2,
                        color: '#8b93a1',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 16,
                          borderRadius: 999,
                          bgcolor: form.returnAddress ? brand.accent : '#d7dde5',
                          position: 'relative',
                          mr: 0.6,
                        }}
                      >
                        <Box
                          sx={{
                            width: 11,
                            height: 11,
                            borderRadius: 999,
                            bgcolor: '#fff',
                            position: 'absolute',
                            top: 2.5,
                            left: form.returnAddress ? 14 : 2.5,
                          }}
                        />
                      </Box>
                      Return Address (if any)
                    </Button>
                  </Stack>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                      gap: 1,
                    }}
                  >
                    {warehouseCards.map((card) => (
                      <Box key={card.label} sx={{ ...sectionCardSx, p: 1.15, minHeight: 90 }}>
                        <Stack direction="row" spacing={0.8} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 999,
                              display: 'grid',
                              placeItems: 'center',
                              color: brand.accent,
                              bgcolor: alpha(brand.accent, 0.08),
                              fontSize: 14,
                            }}
                          >
                            <FiMapPin />
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.78rem', color: '#8b93a1' }}>{card.label}</Typography>
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#2f343c', mt: 0.2 }}>
                              {selectedPickup ? selectedPickup.label : card.title}
                            </Typography>
                            <Typography sx={{ fontSize: '0.76rem', color: '#99a1ad', mt: 0.35 }}>
                              {selectedPickup
                                ? `${selectedPickup.address || 'NA'}, ${selectedPickup.city || 'NA'}`
                                : card.subtitle}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ ...sectionCardSx, p: 1.5 }}>
                  <SectionTitle>Where are you sending it?</SectionTitle>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                      gap: 1,
                    }}
                  >
                    <TextField label="Consignee Name *" value={form.consigneeName} onChange={(e) => updateField('consigneeName', e.target.value)} sx={fieldSx} />
                    <TextField label="Mobile Number *" value={form.mobileNumber} onChange={(e) => updateField('mobileNumber', e.target.value)} sx={fieldSx} />
                    <TextField label="Enter alt contact" value={form.altContact} onChange={(e) => updateField('altContact', e.target.value)} sx={fieldSx} />
                    <TextField label="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} sx={fieldSx} />
                    <TextField label="Address Line 1 *" multiline rows={2} value={form.address1} onChange={(e) => updateField('address1', e.target.value)} sx={{ ...fieldSx, gridColumn: { xs: 'auto', md: '1 / span 2' } }} />
                    <TextField label="Address Line 2" value={form.address2} onChange={(e) => updateField('address2', e.target.value)} sx={fieldSx} />
                    <TextField select label="Address Type *" value={form.addressType} onChange={(e) => updateField('addressType', e.target.value)} sx={fieldSx}>
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="Office">Office</MenuItem>
                    </TextField>
                    <TextField label="PIN Code *" value={form.pinCode} onChange={(e) => updateField('pinCode', e.target.value)} sx={fieldSx} />
                    <TextField label="City *" value={form.city} onChange={(e) => updateField('city', e.target.value)} sx={fieldSx} />
                    <TextField label="State *" value={form.state} onChange={(e) => updateField('state', e.target.value)} sx={fieldSx} />
                    <TextField select label="Country *" value={form.country} onChange={(e) => updateField('country', e.target.value)} sx={fieldSx}>
                      <MenuItem value="India">India</MenuItem>
                    </TextField>
                  </Box>
                </Box>

                <Box sx={{ ...sectionCardSx, p: 1.5 }}>
                  <SectionTitle>{isReverse ? 'Pickup Details' : 'Invoice / Ref. ID'}</SectionTitle>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                      gap: 1,
                    }}
                  >
                    <TextField label="Invoice / Ref. ID" value={form.invoiceId} onChange={(e) => updateField('invoiceId', e.target.value)} sx={fieldSx} />
                    <TextField label="Pre-generated Waybill" value={form.preGeneratedWaybill} onChange={(e) => updateField('preGeneratedWaybill', e.target.value)} sx={fieldSx} />
                    <TextField select label="Is SDD/NDD?" value={form.sddNdd} onChange={(e) => updateField('sddNdd', e.target.value)} sx={fieldSx}>
                      <MenuItem value="No">No</MenuItem>
                      <MenuItem value="Yes">Yes</MenuItem>
                    </TextField>
                  </Box>
                </Box>

                <Box sx={{ ...sectionCardSx, p: 1.5 }}>
                  <SectionTitle>Product Details</SectionTitle>
                  <Stack spacing={1.2}>
                    {productRows.map((row, index) => (
                      <Box key={`product-row-${index}`}>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                            gap: 1,
                          }}
                        >
                          <TextField label="Product Name *" value={row.productName} onChange={(e) => updateProductField(index, 'productName', e.target.value)} sx={fieldSx} />
                          <TextField label="Quantity *" value={row.quantity} onChange={(e) => updateProductField(index, 'quantity', e.target.value)} sx={fieldSx} />
                          <TextField label="Value *" value={row.value} onChange={(e) => updateProductField(index, 'value', e.target.value)} sx={fieldSx} />
                          <TextField label="SKU" value={row.sku} onChange={(e) => updateProductField(index, 'sku', e.target.value)} sx={fieldSx} />
                          <TextField label="HSN" value={row.hsn} onChange={(e) => updateProductField(index, 'hsn', e.target.value)} sx={fieldSx} />
                          <TextField label="Category" value={row.category} onChange={(e) => updateProductField(index, 'category', e.target.value)} sx={fieldSx} />
                        </Box>
                        {productRows.length > 1 ? (
                          <Button
                            onClick={() => removeProductRow(index)}
                            sx={{
                              mt: 0.6,
                              minWidth: 'auto',
                              px: 0,
                              textTransform: 'none',
                              fontSize: '0.8rem',
                              color: '#d14343',
                            }}
                          >
                            Remove row
                          </Button>
                        ) : null}
                        {index < productRows.length - 1 ? <Divider sx={{ mt: 1, borderColor: '#eceff4' }} /> : null}
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    onClick={addProductRow}
                    startIcon={<FiPlusCircle size={14} />}
                    sx={{ mt: 1, textTransform: 'none', fontSize: '0.82rem', color: brand.accent, px: 0, minWidth: 'auto' }}
                  >
                    Add More
                  </Button>
                </Box>

                <Box sx={{ ...sectionCardSx, p: 1.5 }}>
                  <SectionTitle>Order Details</SectionTitle>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                      gap: 1,
                    }}
                  >
                    <TextField select label="Payment Mode *" value={form.paymentMode} onChange={(e) => updateField('paymentMode', e.target.value)} sx={fieldSx}>
                      <MenuItem value="">Select Payment Mode</MenuItem>
                      <MenuItem value="Prepaid">Prepaid</MenuItem>
                      <MenuItem value="COD">COD</MenuItem>
                    </TextField>
                    <TextField label="Order Amount *" value={form.orderAmount} onChange={(e) => updateField('orderAmount', e.target.value)} sx={fieldSx} />
                    <TextField label="GST Amount *" value={form.gstAmount} onChange={(e) => updateField('gstAmount', e.target.value)} sx={fieldSx} />
                    <TextField label="Extra Charges (if any)" value={form.extraCharges} onChange={(e) => updateField('extraCharges', e.target.value)} sx={fieldSx} />
                    <TextField
                      label="Total Amount *"
                      value={computedTotal.toFixed(2)}
                      InputProps={{ readOnly: true }}
                      sx={fieldSx}
                    />
                    <TextField label="Collectible COD Amt." value={form.codAmount} onChange={(e) => updateField('codAmount', e.target.value)} sx={fieldSx} />
                  </Box>
                </Box>

                <Box sx={{ ...sectionCardSx, p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <SectionTitle>Package Details</SectionTitle>
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      <Typography sx={{ fontSize: '0.8rem', color: '#7c8592' }}>MPS</Typography>
                      <TextField select value={form.mps} onChange={(e) => updateField('mps', e.target.value)} sx={{ ...fieldSx, width: 110 }}>
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                      </TextField>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={2.2} alignItems="center" mb={1.15} flexWrap="wrap" useFlexGap>
                    {['0.5 KG', '1 KG', '2 KG', '5 KG', 'Others'].map((weight) => {
                      const active = weight === selectedWeight
                      return (
                        <Button
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          sx={{ minWidth: 'auto', p: 0, textTransform: 'none', fontSize: '0.8rem', color: active ? brand.accent : '#7b8390' }}
                        >
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: 999,
                              border: `1px solid ${active ? brand.accent : '#c7ccd6'}`,
                              mr: 0.6,
                              display: 'inline-grid',
                              placeItems: 'center',
                            }}
                          >
                            {active ? <Box sx={{ width: 7, height: 7, borderRadius: 999, bgcolor: brand.accent }} /> : null}
                          </Box>
                          {weight}
                        </Button>
                      )
                    })}
                  </Stack>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                      gap: 1,
                    }}
                  >
                    <TextField label="Actual Wt (kg) *" value={form.actualWeight} onChange={(e) => updateField('actualWeight', e.target.value)} sx={fieldSx} />
                    <TextField label="Length (cm) *" value={form.length} onChange={(e) => updateField('length', e.target.value)} sx={fieldSx} />
                    <TextField label="Width (cm) *" value={form.width} onChange={(e) => updateField('width', e.target.value)} sx={fieldSx} />
                    <TextField label="Height (cm) *" value={form.height} onChange={(e) => updateField('height', e.target.value)} sx={fieldSx} />
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              bgcolor: '#f6f6f6',
              borderRadius: '16px',
              p: 1.5,
              position: { xs: 'static', xl: 'sticky' },
              top: 92,
            }}
          >
            <SectionTitle>Select your courier partner</SectionTitle>
            <Box sx={{ ...sectionCardSx, p: 1.5 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  mb: 1.25,
                }}
              >
                <TextField select label="Express" value={form.expressType} onChange={(e) => updateField('expressType', e.target.value)} sx={fieldSx}>
                  <MenuItem value="">Surface</MenuItem>
                  <MenuItem value="Express">Express</MenuItem>
                  <MenuItem value="Surface">Surface</MenuItem>
                </TextField>
                <TextField select label="Sort" value={form.sortBy} onChange={(e) => updateField('sortBy', e.target.value)} sx={fieldSx}>
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="rate">Sort : Rate</MenuItem>
                  <MenuItem value="tat">Sort : TAT</MenuItem>
                </TextField>
              </Box>

              <Stack spacing={0.8} mb={11}>
                <Box sx={{ ...sectionCardSx, p: 1.2, minHeight: 56 }}>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Box sx={{ width: 14, height: 14, borderRadius: 999, border: '1px solid #d7dde5', bgcolor: '#fff' }} />
                    <Typography sx={{ fontSize: '0.84rem', color: '#68707d' }}>Courier Selection</Typography>
                  </Stack>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: '#eceff4', mb: 1 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: '#4b5563' }}>
                  Total(Incl. GST)
                </Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#2f343c' }}>
                  {'\u20B9'}
                  {computedTotal.toFixed(2)}
                </Typography>
              </Stack>
              <Button
                fullWidth
                onClick={handleCreateOrder}
                disabled={createShipmentMutation.isPending}
                sx={{
                  minHeight: 44,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  bgcolor: brand.accent,
                  color: '#fff',
                }}
              >
                {createShipmentMutation.isPending ? 'Creating Order...' : 'Create Order'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

