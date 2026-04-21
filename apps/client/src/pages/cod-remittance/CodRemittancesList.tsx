import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import ParcelXDateRangePicker, { getDefaultRange, type RangeValue } from '../../components/UI/inputs/ParcelXDateRangePicker'
import { brand } from '../../theme/brand'

const panelSx = {
  bgcolor: '#FFFFFF',
  border: '1px solid #e5e7eb',
  borderRadius: '14px',
  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
}

const topTabs = [
  { label: "COD's", path: '/billing/cod' },
  { label: 'Order Invoice', path: '/billing/orderinvoice' },
  { label: 'Communication Invoice', path: '/billing/communicationinvoice' },
]

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 42,
    borderRadius: '10px',
    fontSize: '0.9rem',
    '& fieldset': { borderColor: '#e5e7eb' },
  },
}

const chartLegend = [
  { label: 'Remitted', color: '#16a34a' },
  { label: 'Accruing', color: '#d97706' },
  { label: 'Generated', color: '#2563eb' },
]

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

export default function CodRemittancesList() {
  const location = useLocation()
  const [dateRange, setDateRange] = useState<RangeValue>(() => getDefaultRange())

  return (
    <Box sx={{ p: '18px 18px 26px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          alignItems={{ xl: 'center' }}
          justifyContent="space-between"
          sx={{ ...panelSx, p: 1.25, gap: 1.2 }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {topTabs.map((tab) => {
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
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: active ? '#FFFFFF' : '#4b5563',
                    bgcolor: active ? '#111827' : '#f5f7fb',
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
                color: '#FFFFFF',
                bgcolor: brand.accent,
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
          sx={{ ...panelSx, p: 1.25 }}
        >
          <TextField select value="COD Date" sx={{ ...fieldSx, minWidth: 150 }}>
            <MenuItem value="COD Date">COD Date</MenuItem>
          </TextField>
          <Box sx={{ ...fieldSx, flex: 1 }}>
            <ParcelXDateRangePicker
              value={dateRange}
              onApply={setDateRange}
              placeholder="Select Date Range"
              wrapperClassName="date-wrapper mui-date-wrapper"
              inputClassName="custom-range-picker mui-range-picker"
            />
          </Box>
          <Button
            sx={{
              minHeight: 42,
              px: 2.2,
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#FFFFFF',
              bgcolor: brand.accent,
            }}
          >
            Search
          </Button>
          <Button
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#4b5563',
              border: '1px solid #e5e7eb',
            }}
          >
            Reset
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.9fr 2.1fr' },
            gap: 1.5,
          }}
        >
          <Box
            sx={{ ...panelSx, minHeight: 250, display: 'grid', placeItems: 'center', color: '#9ca3af', fontSize: '0.96rem' }}
          >
            No data available
          </Box>

          <Box sx={{ ...panelSx, p: 2, minHeight: 250 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>COD Remitted</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {chartLegend.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      px: 1.5,
                      py: 0.55,
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: item.color,
                      border: `1px solid ${item.color}33`,
                      background: `${item.color}14`,
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Stack>
            </Stack>

            <Stack spacing={1.1} sx={{ color: '#9ca3af', fontSize: '0.84rem' }}>
              {['Rs 10,000', 'Rs 8,000', 'Rs 6,000', 'Rs 4,000', 'Rs 2,000', 'Rs 0'].map((label) => (
                <Typography key={label} sx={{ fontSize: '0.84rem' }}>
                  {label}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box sx={{ ...panelSx, p: 2 }}>
          <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" spacing={1.2} mb={1.4}>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>View COD History</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                startIcon={<FiDownload size={16} />}
                sx={{ minHeight: 40, px: 1.8, borderRadius: '10px', textTransform: 'none', fontSize: '0.84rem', color: '#374151', border: '1px solid #e5e7eb' }}
              >
                All COD Export at AWB Level
              </Button>
              <Button
                sx={{ minHeight: 40, px: 1.8, borderRadius: '10px', textTransform: 'none', fontSize: '0.84rem', color: '#374151', border: '1px solid #e5e7eb' }}
              >
                TRN COD Export
              </Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.2} mb={1.2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.82rem', color: '#111827' }}>Item Per Page:</Typography>
              <TextField select value="100" sx={{ ...fieldSx, minWidth: 90 }}>
                <MenuItem value="100">100</MenuItem>
              </TextField>
            </Stack>
            <Typography sx={{ fontSize: '0.84rem', color: '#6b7280' }}>Page 1 of 1</Typography>
          </Stack>

          <Box sx={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff' }}>
            <Box
              sx={{
                minWidth: 1240,
                display: 'grid',
                gridTemplateColumns: '50px repeat(10, minmax(98px, 1fr))',
                alignItems: 'center',
              }}
            >
              <Box sx={{ py: 1.25, px: 1 }}>
                <Box sx={{ width: 14, height: 14, border: '1px solid #d1d5db', borderRadius: '3px' }} />
              </Box>
              {[
                'COD ID / TRN',
                'COD Date',
                'AWB Count',
                'Amount',
                'Refund',
                'Delivered to RTO Reversal',
                'Adjust in Wallet',
                'Advance Paid / Excess Paid',
                'Invoice Adjust',
                'Action',
              ].map((header) => (
                <Typography
                  key={header}
                  sx={{ py: 1.25, px: 0.9, fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}
                >
                  {header}
                </Typography>
              ))}
            </Box>

            <Box sx={{ minHeight: 220, display: 'grid', placeItems: 'center', color: '#9ca3af', fontSize: '0.92rem' }}>
              No data
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
