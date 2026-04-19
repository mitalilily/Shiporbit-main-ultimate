import { Box, Button, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { FiCalendar, FiDownload, FiUpload } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import { brand } from '../../theme/brand'

type InvoiceVariant = 'order' | 'communication'

interface BillingInvoiceShellProps {
  variant: InvoiceVariant
}

const topTabs = [
  { label: "COD's", path: '/billing/cod' },
  { label: 'Order Invoice', path: '/billing/orderinvoice' },
  { label: 'Communication Invoice', path: '/billing/communicationinvoice' },
]

const inputSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 42,
    borderRadius: '10px',
    backgroundColor: '#fff',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.88rem',
    '& fieldset': { borderColor: '#e5e7eb' },
  },
}

const tableColumns = [
  'Invoice #',
  'Invoice Date',
  'Amount',
  'Shipment Count',
  'Settlements',
  'Status',
  'Payment Date',
  'Ageing',
  'Payment Transaction ID',
  'Action',
]

export default function BillingInvoiceShell({ variant }: BillingInvoiceShellProps) {
  const location = useLocation()
  const title = variant === 'order' ? 'Order Invoice' : 'Communication Invoice'

  return (
    <Box sx={{ p: '18px 18px 26px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          alignItems={{ xl: 'center' }}
          justifyContent="space-between"
          sx={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            p: 1.25,
            gap: 1.2,
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {topTabs.map((tab) => {
              const active = location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`)
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
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: active ? '#fff' : '#4b5563',
                    background: active ? '#111827' : '#f5f7fb',
                    border: active ? '1px solid #111827' : '1px solid #e5e7eb',
                  }}
                >
                  {tab.label}
                </Button>
              )
            })}
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              startIcon={<FiDownload size={16} />}
              sx={{
                minHeight: 40,
                px: 1.6,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.85rem',
                color: '#374151',
                border: '1px solid #e5e7eb',
                background: '#fff',
              }}
            >
              Download Sample File
            </Button>
            <Button
              component="label"
              startIcon={<FiUpload size={16} />}
              sx={{
                minHeight: 40,
                px: 1.6,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.85rem',
                color: '#374151',
                border: '1px solid #e5e7eb',
                background: '#fff',
              }}
            >
              Upload
              <input type="file" accept=".csv" hidden />
            </Button>
            <Button
              sx={{
                minHeight: 40,
                px: 2.2,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#fff',
                background: brand.accent,
              }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1.25}
          alignItems={{ lg: 'center' }}
          sx={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            p: 1.25,
          }}
        >
          <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#111827', minWidth: 92 }}>
            Select Date
          </Typography>
          <TextField
            value="19 Oct, 2025 12:00 am - 19 Apr, 2026 11:59 pm"
            sx={{ ...inputSx, flex: 1 }}
            InputProps={{ endAdornment: <FiCalendar size={16} color="#6b7280" /> }}
          />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.9fr 2.1fr' },
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              background: '#fff',
              minHeight: 250,
              display: 'grid',
              placeItems: 'center',
              color: '#9ca3af',
              fontSize: '0.96rem',
            }}
          >
            No data available
          </Box>

          <Box
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              background: '#fff',
              minHeight: 250,
              p: 2,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>{title}</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  sx={{
                    minHeight: 34,
                    px: 2,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fff',
                    background: '#111827',
                  }}
                >
                  Paid
                </Button>
                <Button
                  sx={{
                    minHeight: 34,
                    px: 2,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#4b5563',
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  Due
                </Button>
              </Stack>
            </Stack>
            <Box
              sx={{
                minHeight: 168,
                borderRadius: '10px',
                border: '1px dashed #d1d5db',
                background: '#f9fafb',
                display: 'grid',
                placeItems: 'center',
                color: '#9ca3af',
                fontStyle: 'italic',
                fontSize: '0.9rem',
              }}
            >
              No data available for the selected range
            </Box>
          </Box>
        </Box>

        <Box sx={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1} sx={{ p: 2, pb: 1.4 }}>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{title}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.82rem', color: '#111827' }}>Item Per Page:</Typography>
              <TextField select value="100" sx={{ ...inputSx, minWidth: 90 }}>
                <MenuItem value="100">100</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          <TableContainer>
            <Table sx={{ minWidth: 1180 }}>
              <TableHead>
                <TableRow>
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column}
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', color: '#9ca3af', py: 7 }}>
                    No data
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={1}
            sx={{ p: 2, pt: 1.4 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.82rem', color: '#111827' }}>Item Per Page:</Typography>
              <TextField select value="100" sx={{ ...inputSx, minWidth: 90 }}>
                <MenuItem value="100">100</MenuItem>
              </TextField>
            </Stack>
            <Typography sx={{ fontSize: '0.84rem', color: '#6b7280' }}>Page 1 of 1</Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
