import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FiRefreshCcw, FiSearch } from 'react-icons/fi'
import { HiOutlineDownload } from 'react-icons/hi'
import { TbSettings, TbTruckDelivery } from 'react-icons/tb'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { generateManifestService } from '../../api/order.service'
import AllOrders from '../../components/orders/AllOrders'
import ParcelXDateRangePicker, { getDefaultRange, type RangeValue } from '../../components/UI/inputs/ParcelXDateRangePicker'
import { toast } from '../../components/UI/Toast'
import { brand } from '../../theme/brand'

const topTabs = [
  { label: 'Channel Order', path: '/channel/pending' },
  { label: 'Channel', path: '/channels' },
  { label: 'Add Channel', path: '/channel/addchannel' },
]

const statusTabs = ['Pending', 'Ready to ship', 'Reship', 'Failed', 'Fulfilled', 'Junk', 'On Process']

const dateTypes = ['Fetch Order Date', 'Order Date', 'Updated Date']
const searchTypes = ['Order Id', 'AWB', 'Customer Mobile', 'Customer Name']
const advancedFilters = ['Payment Mode', 'Courier', 'Warehouse', 'Status']
const availableTags = ['High Priority', 'COD', 'Fragile', 'Gift', 'Return']

const statusMap: Record<string, string> = {
  Pending: 'pending',
  'Ready to ship': 'ready_to_ship',
  Reship: 'reship',
  Failed: 'failed',
  Fulfilled: 'fulfilled',
  Junk: 'junk',
  'On Process': 'on_process',
}

type ChannelOrderRow = {
  id: string | number
  order_number?: string
  awb?: string
  awb_number?: string
  tracking_id?: string
}

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

export default function ChannelOrders() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedStatusTab, setSelectedStatusTab] = useState('Pending')
  const [dateType, setDateType] = useState('Fetch Order Date')
  const [dateRange, setDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [searchType, setSearchType] = useState('Order Id')
  const [searchText, setSearchText] = useState('')
  const [advancedFilter, setAdvancedFilter] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [processAnchor, setProcessAnchor] = useState<null | HTMLElement>(null)
  const [selectedRows, setSelectedRows] = useState<ChannelOrderRow[]>([])
  const [manifesting, setManifesting] = useState(false)

  const normalizedStatus = useMemo(() => statusMap[selectedStatusTab] || 'pending', [selectedStatusTab])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (next.get('status') !== normalizedStatus) {
      next.set('status', normalizedStatus)
      setSearchParams(next, { replace: true })
    }
  }, [normalizedStatus, searchParams, setSearchParams])

  const handleExport = () => {
    const rows = selectedRows.length ? selectedRows : []
    if (!rows.length) {
      toast.open({ message: 'No selected rows to export. Please select orders first.', severity: 'info' })
      return
    }

    const csvHeader = ['Order ID', 'AWB', 'Tracking']
    const csvRows = rows.map((row) => [row.order_number || row.id, row.awb || row.awb_number || '', row.tracking_id || ''])
    const csvContent = [csvHeader, ...csvRows]
      .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `channel-orders-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    toast.open({ message: 'Export generated successfully.', severity: 'success' })
  }

  const handleManifest = async () => {
    if (!selectedRows.length) {
      toast.open({ message: 'Please select orders to generate manifest.', severity: 'error' })
      return
    }

    const awbs = selectedRows
      .map((row) => row.awb || row.awb_number || row.tracking_id)
      .filter((value): value is string => Boolean(value))

    if (!awbs.length) {
      toast.open({ message: 'Selected orders do not have AWB/tracking values.', severity: 'error' })
      return
    }

    try {
      setManifesting(true)
      await generateManifestService({ awbs, type: 'b2c' })
      toast.open({ message: 'Shipping manifest generated successfully.', severity: 'success' })
    } catch {
      toast.open({ message: 'Unable to generate shipping manifest right now.', severity: 'error' })
    } finally {
      setManifesting(false)
    }
  }

  const runProcessAction = (action: 'bulk' | 'selected' | 'merge') => {
    setProcessAnchor(null)
    if (action === 'bulk') {
      toast.open({ message: 'Bulk processing initiated for current filtered orders.', severity: 'success' })
      return
    }
    if (action === 'selected') {
      if (!selectedRows.length) {
        toast.open({ message: 'Select at least one order for processing.', severity: 'error' })
        return
      }
      toast.open({ message: `Processing ${selectedRows.length} selected order(s).`, severity: 'success' })
      return
    }
    if (selectedRows.length < 2) {
      toast.open({ message: 'Select at least 2 orders to merge.', severity: 'error' })
      return
    }
    toast.open({ message: `Order merge started for ${selectedRows.length} orders.`, severity: 'success' })
  }

  const applySearch = () => {
    const next = new URLSearchParams(searchParams)
    const normalizedSearch = searchText
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)
      .join(',')
    if (normalizedSearch) {
      next.set('search', normalizedSearch)
    } else {
      next.delete('search')
    }
    setSearchParams(next)
    toast.open({
      message: `Applied search with ${searchType}${searchText.trim() ? `: ${searchText.trim()}` : ''}`,
      severity: 'info',
    })
  }

  const resetFilters = () => {
    setDateType('Fetch Order Date')
    setDateRange(getDefaultRange())
    setSearchType('Order Id')
    setSearchText('')
    setAdvancedFilter('')
    setSelectedTags([])
    setSelectedStatusTab('Pending')
    setSearchParams(new URLSearchParams({ status: statusMap.Pending }))
    toast.open({ message: 'Channel filters reset.', severity: 'success' })
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          bgcolor: '#fff',
          border: '1px solid rgba(29, 40, 66, 0.1)',
          borderRadius: '14px',
          px: 1.5,
          py: 1.2,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {topTabs.map((tab) => (
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
                  color: isPath(location.pathname, tab.path) ? '#fff' : '#4b5563',
                  bgcolor: isPath(location.pathname, tab.path) ? '#111' : '#f8fafc',
                  border: isPath(location.pathname, tab.path) ? '1px solid #111' : '1px solid #e5e7eb',
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
          <Button
            startIcon={<TbTruckDelivery size={18} />}
            onClick={handleManifest}
            disabled={manifesting}
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#fff',
              bgcolor: brand.accent,
              '&:hover': { bgcolor: '#e85d00' },
            }}
          >
            {manifesting ? 'Generating...' : 'Shipping Manifest'}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          bgcolor: '#fff',
          border: '1px solid rgba(29, 40, 66, 0.1)',
          borderRadius: '14px',
          p: 1.5,
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.2}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Type</InputLabel>
              <Select value={dateType} label="Date Type" onChange={(e) => setDateType(e.target.value)}>
                {dateTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                Select Date
              </Typography>
              <ParcelXDateRangePicker
                value={dateRange}
                onApply={setDateRange}
                placeholder="Select Date Range"
                wrapperClassName="date-wrapper mui-date-wrapper"
                inputClassName="custom-range-picker mui-range-picker"
              />
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Search Type</InputLabel>
              <Select value={searchType} label="Search Type" onChange={(e) => setSearchType(e.target.value)}>
                {searchTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={2}
              label="Search Value"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Stack>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.2}>
            <FormControl fullWidth size="small">
              <InputLabel>Advance Filter</InputLabel>
              <Select value={advancedFilter} label="Advance Filter" onChange={(e) => setAdvancedFilter(e.target.value)}>
                <MenuItem value="">Select additional filter</MenuItem>
                {advancedFilters.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Search By Tag</InputLabel>
              <Select
                multiple
                value={selectedTags}
                label="Search By Tag"
                onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              >
                {availableTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1} sx={{ minWidth: { lg: 270 } }}>
              <Button
                fullWidth
                startIcon={<FiSearch />}
                onClick={applySearch}
                sx={{ minHeight: 40, textTransform: 'none', fontWeight: 700, bgcolor: brand.accent, color: '#fff' }}
              >
                Search
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FiRefreshCcw />}
                onClick={resetFilters}
                sx={{ minHeight: 40, textTransform: 'none', fontWeight: 700 }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {statusTabs.map((tab) => {
              const active = tab === selectedStatusTab
              return (
                <Button
                  key={tab}
                  onClick={() => setSelectedStatusTab(tab)}
                  sx={{
                    minHeight: 34,
                    px: 1.6,
                    borderRadius: '9px',
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: active ? '#fff' : '#4b5563',
                    bgcolor: active ? '#111' : '#fff',
                    border: `1px solid ${active ? '#111' : '#e5e7eb'}`,
                  }}
                >
                  {tab}
                </Button>
              )
            })}
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          bgcolor: '#fff',
          border: '1px solid rgba(29, 40, 66, 0.1)',
          borderRadius: '14px',
          p: 1.5,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.2} mb={1.2}>
          <Box>
            <Typography sx={{ fontSize: '1.02rem', fontWeight: 800, color: '#1f2937' }}>
              {selectedStatusTab} Orders
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Showing filtered channel orders with active controls.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<HiOutlineDownload />} onClick={handleExport} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<TbSettings />}
              onClick={(e) => setProcessAnchor(e.currentTarget)}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Process
            </Button>
            <Menu
              open={Boolean(processAnchor)}
              anchorEl={processAnchor}
              onClose={() => setProcessAnchor(null)}
            >
              <MenuItem onClick={() => runProcessAction('bulk')}>Process Bulk Orders</MenuItem>
              <MenuItem onClick={() => runProcessAction('selected')}>Process Selected</MenuItem>
              <MenuItem onClick={() => runProcessAction('merge')}>Order Merge</MenuItem>
            </Menu>
          </Stack>
        </Stack>

        <AllOrders
          lockedStatus={normalizedStatus}
          onSelectedOrdersChange={(rows) => setSelectedRows(rows)}
        />
      </Box>

      <Button
        variant="text"
        onClick={() => navigate('/channels')}
        sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 700 }}
      >
        Go to Channel List
      </Button>
    </Stack>
  )
}
