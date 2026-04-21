import {
  Box,
  Button,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { FiChevronDown, FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi'
import CustomDrawer from '../../components/UI/drawer/CustomDrawer'
import ParcelXDateRangePicker, { getDefaultRange, type RangeValue } from '../../components/UI/inputs/ParcelXDateRangePicker'
import { SupportTicketForm } from '../../components/support/SupportTicketForm'
import { useMyTickets } from '../../hooks/User/useSupport'
import { brand } from '../../theme/brand'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 40,
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.82rem',
    '& fieldset': { borderColor: '#e6eaef' },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.82rem',
    py: 1.05,
  },
}

const cardSx = {
  background: '#fff',
  border: '1px solid #ece9f1',
  borderRadius: '14px',
  boxShadow: 'none',
}

const ticketTabs = ['Open (0)', 'Resolved (0)', 'Pending (0)', 'Reopen (0)', 'Closed (0)', 'All (0)']

export const SupportTicketsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dateRange, setDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [dateType, setDateType] = useState('Created Date')
  const [priority, setPriority] = useState('')
  const [aging, setAging] = useState('')
  const [searchType, setSearchType] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [activeTab, setActiveTab] = useState(ticketTabs[0])

  const { data: tickets } = useMyTickets({
    page: 1,
    limit: 50,
    filters: {},
  })

  const rows = useMemo(() => tickets?.data ?? [], [tickets])

  return (
    <Box sx={{ p: '18px 18px 28px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Stack spacing={1.6}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.2}>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 600, color: '#232b34' }}>
            Facing an issue? Raise a ticket.
          </Typography>
          <Button
            onClick={() => setDrawerOpen(true)}
            startIcon={<FiPlus />}
            sx={{
              alignSelf: { xs: 'flex-start', sm: 'center' },
              minHeight: 38,
              px: 2.2,
              borderRadius: '6px',
              textTransform: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: brand.accent,
              color: '#fff',
            }}
          >
            Add Ticket
          </Button>
        </Stack>

        <Box sx={{ ...cardSx, p: '14px 16px 16px' }}>
          <Stack
            className="wrapperdz-filtz mb-3"
            direction={{ xs: 'column', xl: 'row' }}
            spacing={1.25}
            flexWrap="wrap"
            useFlexGap
            alignItems={{ xl: 'flex-end' }}
          >
            <Box sx={{ minWidth: 170 }}>
              <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                Date Type
              </Typography>
              <TextField
                select
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                sx={fieldSx}
                SelectProps={{ IconComponent: FiChevronDown }}
              >
                {['Created Date', 'Updated Date', 'Closed Date'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ minWidth: 320 }}>
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

            <Box sx={{ minWidth: 150 }}>
              <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                Priority
              </Typography>
              <TextField
                select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                sx={fieldSx}
                SelectProps={{ IconComponent: FiChevronDown }}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ minWidth: 150 }}>
              <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                Ticket Aging
              </Typography>
              <TextField
                select
                value={aging}
                onChange={(e) => setAging(e.target.value)}
                sx={fieldSx}
                SelectProps={{ IconComponent: FiChevronDown }}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="0-24h">0-24h</MenuItem>
                <MenuItem value="1-3d">1-3 days</MenuItem>
                <MenuItem value="3d+">3+ days</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ minWidth: 320, flex: 1 }}>
              <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                Search Type
              </Typography>
              <Stack direction="row" spacing={0}>
                <TextField
                  select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  sx={{
                    ...fieldSx,
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      ...fieldSx['& .MuiOutlinedInput-root'],
                      borderRadius: '8px 0 0 8px',
                    },
                  }}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Ticket ID">Ticket ID</MenuItem>
                  <MenuItem value="Order ID">Order ID</MenuItem>
                  <MenuItem value="Subject">Subject</MenuItem>
                </TextField>
                <TextField
                  multiline
                  minRows={1}
                  maxRows={1}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter your input"
                  sx={{
                    ...fieldSx,
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      ...fieldSx['& .MuiOutlinedInput-root'],
                      borderRadius: '0 8px 8px 0',
                    },
                  }}
                />
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<FiSearch />}
                sx={{
                  minHeight: 40,
                  borderRadius: '8px',
                  px: 1.8,
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: brand.accent,
                  color: '#fff',
                }}
              >
                Search
              </Button>
              <Button
                startIcon={<FiRefreshCw />}
                onClick={() => {
                  setPriority('')
                  setAging('')
                  setSearchType('')
                  setSearchValue('')
                }}
                sx={{
                  minHeight: 40,
                  borderRadius: '8px',
                  px: 1.8,
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid #ece9f1',
                  color: '#27303f',
                  background: '#fff',
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {ticketTabs.map((tab, index) => {
              const active = activeTab === tab || (!activeTab && index === 0)
              return (
                <Box
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  sx={{
                    minHeight: 40,
                    px: 2.1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '999px',
                    fontSize: '0.81rem',
                    fontWeight: active ? 700 : 600,
                    color: active ? '#fff' : '#425062',
                    background: active ? '#111' : '#f5f7fa',
                    cursor: 'pointer',
                    transition: 'all 180ms ease',
                  }}
                >
                  {tab}
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box sx={{ ...cardSx, overflow: 'hidden' }}>
          <Box className="warpper___001565 summary-actions" sx={{ px: 2.25, pt: 2, pb: 1.25 }}>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#222a33' }}>
              All Tickets
            </Typography>
          </Box>

          <Box sx={{ px: 2.25, pb: 1.2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '0.82rem', color: '#232c39' }}>Items Per Page:</Typography>
                <TextField
                  select
                  value="50"
                  sx={{ ...fieldSx, width: 78 }}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="50">50</MenuItem>
                </TextField>
              </Stack>
              <Typography sx={{ fontSize: '0.81rem', color: '#8a93a1' }}>1</Typography>
            </Stack>
          </Box>

          <TableContainer sx={{ background: '#f8fafc' }}>
            <Table sx={{ minWidth: 1050 }}>
              <TableHead>
                <TableRow sx={{ background: '#fff' }}>
                  {['S.No.', 'Ticket ID', 'Created On', 'Order Details', 'Subject', 'Remarks', 'Aging', 'Last Update', 'Action'].map((column) => (
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
                        textAlign: column === 'S.No.' || column === 'Action' ? 'center' : 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow sx={{ background: '#fff' }}>
                    <TableCell
                      colSpan={9}
                      sx={{
                        py: 5,
                        textAlign: 'center',
                        color: '#6e7784',
                        fontSize: '0.88rem',
                        fontFamily: 'Instrument Sans, sans-serif',
                        borderBottom: 'none',
                      }}
                    >
                      No data
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ px: 2.25, py: 1.5 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '0.82rem', color: '#232c39' }}>Items Per Page:</Typography>
                <TextField
                  select
                  value="50"
                  sx={{ ...fieldSx, width: 78 }}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="50">50</MenuItem>
                </TextField>
              </Stack>
              <Typography sx={{ fontSize: '0.81rem', color: '#8a93a1' }}>1</Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>

      <CustomDrawer
        title="Create Support Ticket"
        open={drawerOpen}
        width={1100}
        onClose={() => setDrawerOpen(false)}
        anchor="right"
      >
        <Stack sx={{ color: '#fff', p: 2 }} gap={2}>
          <SupportTicketForm
            onSuccess={() => {
              setDrawerOpen(false)
            }}
          />
        </Stack>
      </CustomDrawer>
    </Box>
  )
}

export default SupportTicketsPage
