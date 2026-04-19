import {
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FiCopy, FiEdit2, FiKey, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import { getAuthTokens } from '../../api/tokenVault'
import UserForm from '../../components/settings/user-management/UserForm'
import { toast } from '../../components/UI/Toast'
import { useApiKeys, useCreateApiKey } from '../../hooks/useApiIntegration'
import { useInvoicePreferences } from '../../hooks/User/useInvoicePreferences'
import type { IEmployeePayload } from '../../api/employee.service'
import { useDeleteEmployee, useEmployees, useToggleEmployeeStatus } from '../../hooks/User/useUserManagement'
import { useUserProfile } from '../../hooks/User/useUserProfile'
import { brand, brandGradients } from '../../theme/brand'

const legacyTabs = [
  { label: 'Label Setting', path: '/setting/labelsetting' },
  { label: 'Secure Your Shipment', path: '/setting/secureshipment' },
  { label: 'Manage Team', path: '/setting/manageteam' },
  { label: 'Invoice Settings', path: '/setting/invoicepage' },
  { label: 'API Docs', path: '/setting/apidocs' },
  { label: 'Unique QR Code', path: '/setting/uniqueqr' },
]

const shellSx = {
  background: brandGradients.page,
  minHeight: '100%',
  p: { xs: 2, md: 3 },
  fontFamily: 'Instrument Sans, sans-serif',
}

const panelSx = {
  bgcolor: '#ffffff',
  border: '1px solid #eceff4',
  borderRadius: '18px',
  boxShadow: '0 18px 46px rgba(15, 23, 42, 0.05)',
}

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

const secureRows = [
  {
    title: 'Insurance Charges (%)',
    value: '1.00%',
    detail: '1.00%',
    example: 'Example - If the invoice amount is Rs 10000, Rs 100 + gst will be the insurance charges.',
  },
  {
    title: 'Risk Free Liability Amount',
    value: 'Rs. 1500.00',
    detail: 'Rs. 1500.00',
    example:
      'Example - If a shipment of Rs 1000 is lost, ParcelX will provide the full claim with no insurance charges.',
  },
  {
    title: 'Lost Reimbursement Deduction Percentage',
    value: '2.00%',
    detail: '2.00%',
    example:
      'Example - If a shipment with invoice value Rs 10000 is claimed then ParcelX will reimburse Rs 9800.',
  },
]

const invoiceToggleRows = [
  {
    id: 'shippingCharges',
    title: 'Hide/Show Shipping Charges',
    description: 'The shipping charges will be hidden on the invoice',
  },
  {
    id: 'invoiceLogo',
    title: 'Hide Invoice Logo',
    description: 'Your logo will be shown or hidden according to this setting',
  },
  {
    id: 'invoiceSignature',
    title: 'Hide Invoice Signature',
    description: 'Your signature will be removed from the invoice',
  },
] as const

const formatDateTime = (value?: string) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const buildFakeQrMatrix = (seed: string) => {
  const size = 21
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const inFinder =
        (row < 7 && col < 7) || (row < 7 && col > size - 8) || (row > size - 8 && col < 7)
      if (inFinder) {
        const top = row % 7
        const left = col % 7
        const border = top === 0 || top === 6 || left === 0 || left === 6
        const center = top >= 2 && top <= 4 && left >= 2 && left <= 4
        return border || center
      }
      const cellHash = ((row + 1) * 131 + (col + 1) * 17 + hash) % 5
      return cellHash === 0 || cellHash === 2
    }),
  )
}

const CopyField = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  const copyValue = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    toast.open({ message: `${label} copied`, severity: 'success' })
  }

  return (
    <Stack spacing={0.7}>
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#3e4957' }}>{label}</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e5e9f0',
          borderRadius: '12px',
          minHeight: 48,
          px: 1.4,
          bgcolor: '#fbfcfe',
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: '0.82rem',
            color: value ? '#28313b' : '#99a1ae',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value || 'Not available yet'}
        </Typography>
        <IconButton size="small" onClick={copyValue} disabled={!value}>
          <FiCopy size={16} />
        </IconButton>
      </Box>
    </Stack>
  )
}

const SettingsTabs = ({ pathname }: { pathname: string }) => (
  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
    {legacyTabs.map((tab) => {
      const active = isPath(pathname, tab.path)
      return (
        <Button
          key={tab.path}
          component={NavLink}
          to={tab.path}
          sx={{
            minHeight: 40,
            px: 1.7,
            borderRadius: '999px',
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: active ? '#ffffff' : '#5f6877',
            bgcolor: active ? brand.accent : '#ffffff',
            border: active ? '1px solid transparent' : '1px solid #e6ebf2',
            '&:hover': {
              bgcolor: active ? '#f26a11' : '#f8fafc',
            },
          }}
        >
          {tab.label}
        </Button>
      )
    })}
  </Stack>
)

const SecureShipmentSection = () => {
  const [autoSecure, setAutoSecure] = useState(false)

  return (
    <Stack spacing={2}>
      <Box sx={panelSx}>
        <TableContainer>
          <Table>
            <TableBody>
              {secureRows.map((row) => (
                <TableRow key={row.title}>
                  <TableCell sx={{ width: '31%', fontWeight: 700, color: '#293241' }}>{row.title}</TableCell>
                  <TableCell sx={{ width: '19%', color: '#4f5a69' }}>{row.value}</TableCell>
                  <TableCell sx={{ color: '#5f6877' }}>
                    <Typography sx={{ fontSize: '0.84rem', color: '#293241', mb: 0.5 }}>{row.detail}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6c7685', lineHeight: 1.7 }}>
                      <b>Example - </b>
                      {row.example.replace(/^Example - /, '')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ ...panelSx, p: 2.2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.2} alignItems={{ md: 'center' }}>
          <Box
            sx={{
              flex: { md: '0 0 360px' },
              border: '1px solid #edf1f6',
              borderRadius: '16px',
              p: 2,
              bgcolor: '#fcfdff',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Box>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#293241' }}>
                  Auto "Secure" all shipment
                </Typography>
                <Typography
                  component="a"
                  href="http://app.parcelx.in/assets/samples/Insurance-Terms-and-Conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-block',
                    mt: 1,
                    fontSize: '0.82rem',
                    color: brand.accent,
                    textDecoration: 'none',
                  }}
                >
                  Terms &amp; Conditions
                </Typography>
              </Box>
              <Switch
                checked={autoSecure}
                onChange={(event) => setAutoSecure(event.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: brand.accent },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: alpha(brand.accent, 0.55),
                  },
                }}
              />
            </Stack>
          </Box>

          <Stack spacing={1.6}>
            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#293241', mb: 0.5 }}>
                What is Secure Shipment?
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', color: '#6c7685', lineHeight: 1.75 }}>
                You can secure your shipment with invoice value greater than Rs. 1500 against loss and damages.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#293241', mb: 0.5 }}>
                Why secure your shipment?
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', color: '#6c7685', lineHeight: 1.75 }}>
                If a high-value shipment is lost in transit then the overall operating cost increases significantly.
                Protecting shipments from loss or damage helps reduce replacement and support costs.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

const ManageTeamSection = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useEmployees(25)
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee()
  const { mutate: toggleEmployeeStatus, isPending: isToggling } = useToggleEmployeeStatus()
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<IEmployeePayload | null>(null)

  const users = data?.pages.flatMap((page) => page.employees) ?? []

  return (
    <>
      <Box sx={{ ...panelSx, p: 2.2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          mb={2}
        >
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#293241' }}>Manage Team</Typography>
          <Button
            onClick={() => {
              setEditingUser(null)
              setFormOpen(true)
            }}
            sx={{
              borderRadius: '12px',
              border: '1px solid #dfe5ee',
              px: 1.8,
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 700,
              color: '#293241',
            }}
          >
            Add New Member
          </Button>
        </Stack>

        <TableContainer sx={{ border: '1px solid #eef2f6', borderRadius: '14px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafbfd' }}>
              <TableRow>
                {['Date/Time', 'Person Name', 'Email', 'Mobile Number', 'Status', 'Action'].map((heading) => (
                  <TableCell key={heading} sx={{ fontWeight: 800, color: '#45515f' }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 6 }}>
                    <Stack spacing={1} alignItems="center" justifyContent="center">
                      <Box
                        sx={{
                          width: 68,
                          height: 68,
                          borderRadius: '20px',
                          bgcolor: '#f4f6fa',
                          border: '1px solid #e6ebf2',
                        }}
                      />
                      <Typography sx={{ color: '#7c8696', fontSize: '0.92rem' }}>No data</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ color: '#5f6877' }}>{formatDateTime((user as { createdAt?: string }).createdAt)}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#293241' }}>{user.name}</TableCell>
                    <TableCell sx={{ color: '#5f6877' }}>{user.email || '--'}</TableCell>
                    <TableCell sx={{ color: '#5f6877' }}>{user.phone || '--'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            bgcolor: user.isActive ? alpha('#22c55e', 0.12) : alpha('#94a3b8', 0.15),
                            color: user.isActive ? '#15803d' : '#475569',
                            fontWeight: 700,
                          }}
                        />
                        <Switch
                          size="small"
                          checked={user.isActive}
                          disabled={isToggling}
                          onChange={(event) =>
                            toggleEmployeeStatus(
                              { id: user.id, isActive: event.target.checked },
                              {
                                onSuccess: () => {
                                  queryClient.invalidateQueries({ queryKey: ['employees'] })
                                },
                              },
                            )
                          }
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: brand.accent },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: alpha(brand.accent, 0.55),
                            },
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.8}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingUser(user)
                            setFormOpen(true)
                          }}
                        >
                          <FiEdit2 size={15} />
                        </IconButton>
                        <IconButton
                          size="small"
                          disabled={isDeleting}
                          onClick={() => {
                            if (!window.confirm(`Delete ${user.name}?`)) return
                            deleteEmployee(user.id, {
                              onSuccess: () => {
                                queryClient.invalidateQueries({ queryKey: ['employees'] })
                              },
                            })
                          }}
                        >
                          <FiTrash2 size={15} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <UserForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingUser(null)
        }}
        defaultValues={editingUser || undefined}
      />
    </>
  )
}

const InvoicePreviewCard = ({
  companyName,
  addressType,
  showShippingCharges,
  showLogo,
  showSignature,
}: {
  companyName: string
  addressType: 'registration' | 'warehouse'
  showShippingCharges: boolean
  showLogo: boolean
  showSignature: boolean
}) => (
  <Box
    sx={{
      minHeight: 430,
      borderRadius: '18px',
      border: '1px solid #e8edf4',
      bgcolor: '#ffffff',
      p: 2.2,
    }}
  >
    <Stack spacing={1.8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#293241' }}>
            {companyName || 'ShipOrbit Merchant'}
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#7c8696', mt: 0.3 }}>
            {addressType === 'registration' ? 'Registration Address' : 'Warehouse Address'}
          </Typography>
        </Box>
        {showLogo ? (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'linear-gradient(180deg, #ff8a3d 0%, #ff6600 100%)',
            }}
          />
        ) : null}
      </Stack>

      <Box sx={{ border: '1px dashed #dde4ee', borderRadius: '14px', p: 1.6 }}>
        <Typography sx={{ fontSize: '0.82rem', color: '#7c8696', mb: 0.5 }}>Invoice Summary</Typography>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ color: '#5f6877', fontSize: '0.84rem' }}>Invoice No.</Typography>
            <Typography sx={{ color: '#293241', fontSize: '0.84rem', fontWeight: 700 }}>INV-2026-001</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ color: '#5f6877', fontSize: '0.84rem' }}>Order Value</Typography>
            <Typography sx={{ color: '#293241', fontSize: '0.84rem', fontWeight: 700 }}>Rs 12,480.00</Typography>
          </Stack>
          {showShippingCharges ? (
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: '#5f6877', fontSize: '0.84rem' }}>Shipping Charges</Typography>
              <Typography sx={{ color: '#293241', fontSize: '0.84rem', fontWeight: 700 }}>Rs 96.00</Typography>
            </Stack>
          ) : null}
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ color: '#5f6877', fontSize: '0.84rem' }}>Total</Typography>
            <Typography sx={{ color: brand.accent, fontSize: '0.92rem', fontWeight: 800 }}>Rs 12,576.00</Typography>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ borderTop: '1px solid #eef2f6', pt: 1.4 }}>
        <Typography sx={{ fontSize: '0.8rem', color: '#7c8696', mb: 0.8 }}>Authorized Signature</Typography>
        {showSignature ? (
          <Typography
            sx={{
              fontFamily: '"Brush Script MT", cursive',
              fontSize: '1.8rem',
              color: '#26313c',
              lineHeight: 1,
            }}
          >
            ShipOrbit
          </Typography>
        ) : (
          <Typography sx={{ fontSize: '0.84rem', color: '#b0b8c4' }}>Hidden from invoice</Typography>
        )}
      </Box>
    </Stack>
  </Box>
)

const InvoiceSettingsSection = () => {
  const { preferences, isLoading } = useInvoicePreferences()
  const [addressType, setAddressType] = useState<'registration' | 'warehouse'>('warehouse')
  const [logoFileName, setLogoFileName] = useState('')
  const [signatureFileName, setSignatureFileName] = useState('')
  const [toggleState, setToggleState] = useState({
    shippingCharges: true,
    invoiceLogo: true,
    invoiceSignature: true,
  })
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const signatureInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setLogoFileName(preferences?.logoFile || '')
    setSignatureFileName(preferences?.signatureFile || '')
  }, [preferences?.logoFile, preferences?.signatureFile])

  return (
    <Box sx={{ ...panelSx, p: 2.2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '1.05fr 0.95fr' },
          gap: 2.2,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {[
              { value: 'registration', label: 'Registration Address' },
              { value: 'warehouse', label: 'Warehouse Address' },
            ].map((option) => {
              const active = addressType === option.value
              return (
                <Button
                  key={option.value}
                  onClick={() => setAddressType(option.value as 'registration' | 'warehouse')}
                  sx={{
                    minHeight: 38,
                    px: 1.5,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: active ? '#ffffff' : '#5f6877',
                    bgcolor: active ? '#293241' : '#f7f9fc',
                    border: '1px solid #e6ebf2',
                  }}
                >
                  {option.label}
                </Button>
              )
            })}
          </Stack>

          <Stack spacing={1.4}>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              hidden
              onChange={(event) => setLogoFileName(event.target.files?.[0]?.name || '')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems={{ sm: 'flex-end' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#3e4957', mb: 0.8 }}>
                  Display Logo (png, jpg, jpeg)
                </Typography>
                <Button
                  onClick={() => logoInputRef.current?.click()}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    minHeight: 46,
                    borderRadius: '12px',
                    border: '1px solid #dfe5ee',
                    textTransform: 'none',
                    color: logoFileName ? '#293241' : '#8a94a4',
                    bgcolor: '#ffffff',
                  }}
                >
                  {logoFileName || 'Choose file'}
                </Button>
              </Box>
              <Button
                onClick={() => toast.open({ message: 'Logo selection updated', severity: 'success' })}
                sx={{
                  minWidth: 110,
                  minHeight: 46,
                  borderRadius: '12px',
                  border: '1px solid #dfe5ee',
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#293241',
                }}
              >
                Update
              </Button>
            </Stack>

            <input
              ref={signatureInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              hidden
              onChange={(event) => setSignatureFileName(event.target.files?.[0]?.name || '')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems={{ sm: 'flex-end' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#3e4957', mb: 0.8 }}>
                  Upload Signature (png, jpg, jpeg)
                </Typography>
                <Button
                  onClick={() => signatureInputRef.current?.click()}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    minHeight: 46,
                    borderRadius: '12px',
                    border: '1px solid #dfe5ee',
                    textTransform: 'none',
                    color: signatureFileName ? '#293241' : '#8a94a4',
                    bgcolor: '#ffffff',
                  }}
                >
                  {signatureFileName || 'Choose file'}
                </Button>
              </Box>
              <Button
                onClick={() => toast.open({ message: 'Signature selection updated', severity: 'success' })}
                sx={{
                  minWidth: 110,
                  minHeight: 46,
                  borderRadius: '12px',
                  border: '1px solid #dfe5ee',
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#293241',
                }}
              >
                Update
              </Button>
            </Stack>
          </Stack>

          <TableContainer sx={{ border: '1px solid #eef2f6', borderRadius: '14px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#fafbfd' }}>
                <TableRow>
                  {['Title', 'Description', 'Action'].map((heading) => (
                    <TableCell key={heading} sx={{ fontWeight: 800, color: '#45515f' }}>
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceToggleRows.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ color: '#293241', fontWeight: 700 }}>
                      <Stack direction="row" spacing={1}>
                        <span>{index + 1}.</span>
                        <span>{row.title}</span>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: '#5f6877' }}>{row.description}</TableCell>
                    <TableCell>
                      <Switch
                        checked={toggleState[row.id]}
                        onChange={(event) =>
                          setToggleState((prev) => ({ ...prev, [row.id]: event.target.checked }))
                        }
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: brand.accent },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: alpha(brand.accent, 0.55),
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        <Box>
          {isLoading ? (
            <Box sx={{ ...panelSx, p: 3, minHeight: 300, display: 'grid', placeItems: 'center' }}>
              <Typography sx={{ color: '#7c8696' }}>Loading Invoice...</Typography>
            </Box>
          ) : (
            <InvoicePreviewCard
              companyName={preferences?.brandName || preferences?.sellerName || ''}
              addressType={addressType}
              showShippingCharges={toggleState.shippingCharges}
              showLogo={toggleState.invoiceLogo}
              showSignature={toggleState.invoiceSignature}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

const ApiDocsSection = () => {
  const { data } = useApiKeys(true)
  const createApiKey = useCreateApiKey()
  const [generatedKeys, setGeneratedKeys] = useState<{ accessKey: string; secretKey: string } | null>(null)

  const accessToken = useMemo(() => getAuthTokens().accessToken || '', [])
  const latestApiKey = data?.data?.[0]

  const regenerateKeys = () => {
    createApiKey.mutate(
      { key_name: `ShipOrbit ${new Date().toLocaleDateString('en-CA')}` },
      {
        onSuccess: (response) => {
          setGeneratedKeys({
            accessKey: response.data.api_key,
            secretKey: response.data.api_secret,
          })
          toast.open({ message: 'API keys generated successfully', severity: 'success' })
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to generate API keys'
          toast.open({ message, severity: 'error' })
        },
      },
    )
  }

  return (
    <Box sx={{ ...panelSx, p: 2.2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2.2,
          alignItems: 'start',
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#293241', mb: 0.7 }}>
              Customize API
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#6c7685', lineHeight: 1.75 }}>
              Our custom API empowers sellers to integrate ShipOrbit capabilities inside their own
              applications with a simple REST workflow and fast response times.
            </Typography>
          </Box>

          <Box
            component="a"
            href="https://documenter.getpostman.com/view/51980911/2sBXc7KjMt"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ...panelSx,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              px: 2,
              py: 1.6,
              textDecoration: 'none',
              color: '#293241',
              maxWidth: 320,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '14px',
                bgcolor: alpha(brand.accent, 0.12),
                color: brand.accent,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <FiKey size={18} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 800 }}>Click to view API</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#7c8696' }}>Open Postman documentation</Typography>
            </Box>
          </Box>
        </Stack>

        <Stack spacing={1.4}>
          <CopyField label="Access Key" value={generatedKeys?.accessKey || latestApiKey?.key_name || ''} />
          <CopyField label="Secret Key" value={generatedKeys?.secretKey || ''} />
          <CopyField label="Access Token" value={accessToken} />
          <Button
            onClick={regenerateKeys}
            disabled={createApiKey.isPending}
            sx={{
              alignSelf: 'flex-start',
              mt: 0.5,
              minHeight: 44,
              px: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              color: '#ffffff',
              bgcolor: '#293241',
              '&:hover': { bgcolor: '#1f2937' },
            }}
            startIcon={<FiRefreshCw size={16} />}
          >
            {createApiKey.isPending ? 'Generating...' : 'Re-Generate Keys'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

const UniqueQrSection = () => {
  const { data: profile } = useUserProfile(true)
  const [open, setOpen] = useState(false)

  const upiValue =
    profile?.bankDetails?.primaryAccount?.upiId ||
    profile?.companyInfo?.companyEmail ||
    'merchant@shiporbit'
  const qrSeed = `upi://pay?pa=${upiValue}&pn=${profile?.companyInfo?.brandName || 'ShipOrbit'}`
  const qrMatrix = useMemo(() => buildFakeQrMatrix(qrSeed), [qrSeed])

  return (
    <>
      <Box sx={{ ...panelSx, p: 2.4 }}>
        <Stack spacing={1.2}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#293241' }}>Your Unique QR Code</Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#6c7685', lineHeight: 1.8, maxWidth: 900 }}>
            Experience seamless payments with the exclusive QR Code feature, enabling you to add any amount
            effortlessly via UPI payments. Your transactions are credited to your ShipOrbit wallet for quick
            access to platform services.
          </Typography>

          <Button
            onClick={() => setOpen(true)}
            sx={{
              mt: 1,
              alignSelf: 'flex-start',
              minHeight: 46,
              px: 2,
              borderRadius: '14px',
              border: '1px solid #dfe5ee',
              textTransform: 'none',
              fontWeight: 800,
              color: '#293241',
            }}
          >
            Click here to view your QR Code
          </Button>
        </Stack>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Unique QR Code</DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems="center" py={1}>
            <Box
              sx={{
                p: 2,
                borderRadius: '18px',
                border: '1px solid #e5e9f0',
                bgcolor: '#ffffff',
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 210 210"
                sx={{ width: 220, height: 220, display: 'block', bgcolor: '#ffffff' }}
              >
                {qrMatrix.map((row, rowIndex) =>
                  row.map((filled, colIndex) =>
                    filled ? (
                      <rect
                        key={`${rowIndex}-${colIndex}`}
                        x={colIndex * 10}
                        y={rowIndex * 10}
                        width="10"
                        height="10"
                        fill="#111111"
                      />
                    ) : null,
                  ),
                )}
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.86rem', color: '#5f6877', textAlign: 'center' }}>
              Linked for wallet top-ups via {upiValue}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function LegacySettingsSections() {
  const location = useLocation()

  const content = useMemo(() => {
    if (isPath(location.pathname, '/setting/secureshipment')) return <SecureShipmentSection />
    if (isPath(location.pathname, '/setting/manageteam')) return <ManageTeamSection />
    if (isPath(location.pathname, '/setting/invoicepage')) return <InvoiceSettingsSection />
    if (isPath(location.pathname, '/setting/apidocs')) return <ApiDocsSection />
    if (isPath(location.pathname, '/setting/uniqueqr')) return <UniqueQrSection />
    return <SecureShipmentSection />
  }, [location.pathname])

  return (
    <Box sx={shellSx}>
      <SettingsTabs pathname={location.pathname} />
      {content}
    </Box>
  )
}
