import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  fetchMyNdr,
  fetchMyNdrTimeline,
  submitNdrChangeAddress,
  submitNdrChangePhone,
  submitNdrReattempt,
} from '../../api/ndr'
import { getPresignedDownloadUrls } from '../../api/upload.api'
import CustomInput from '../../components/UI/inputs/CustomInput'
import ParcelXDateRangePicker, { getDefaultRange, type RangeValue } from '../../components/UI/inputs/ParcelXDateRangePicker'
import FileUploader, { type UploadedFileInfo } from '../../components/UI/uploader/FileUploader'
import { toast } from '../../components/UI/Toast'
import { brand } from '../../theme/brand'

type NdrRow = {
  id?: string
  awb_number?: string
  order_id?: string
  status?: string
  reason?: string
  remarks?: string
  integration_type?: string
  courier_partner?: string
  attempt_no?: string
}

type TimelineEvent = {
  at?: string
  status?: string
  remarks?: string
  reason?: string
  admin_note?: string
  attachment_key?: string
  attachment_name?: string
  attachment_mime?: string
  attachment_url?: string | null
}

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

const issueTabs = [
  'All Issues',
  'Address issue',
  'Payment issue',
  'Other Exceptions',
  'Inaccessible',
  'Refused to accept',
  'Future/ open box',
  'ODA',
]

const recordTabs = ['Active', 'Initiated', 'Closed']
const communicationTabs = [
  { label: 'Credit Recharge', path: '/communication/credit_recharge' },
  { label: 'Recharge History', path: '/communication/recharge_history' },
  { label: 'Notification Setting', path: '/communication/notificationsetting' },
  { label: 'Notification History', path: '/communication/notification-history' },
  { label: 'Ledger', path: '/communication/ladger' },
  { label: 'NDR', path: '/communication/ndr' },
  { label: 'Channels and Price', path: '/communication/channelpricing' },
]

export default function NdrList() {
  const location = useLocation()
  const [rows, setRows] = useState<NdrRow[]>([])
  const [, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page] = useState(1)
  const [rowsPerPage] = useState(50)
  const [dateRange, setDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [dateType, setDateType] = useState('First NDR Date')
  const [searchType, setSearchType] = useState('Order ID')
  const [searchValue, setSearchValue] = useState('')
  const [recordTab, setRecordTab] = useState('Active')
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [timeline, setTimeline] = useState<{ events?: TimelineEvent[] } | null>(null)
  const [selectedAwb, setSelectedAwb] = useState<string | null>(null)
  const [reattemptOpen, setReattemptOpen] = useState(false)
  const [changePhoneOpen, setChangePhoneOpen] = useState(false)
  const [changeAddressOpen, setChangeAddressOpen] = useState(false)
  const [nextAttemptDate, setNextAttemptDate] = useState('')
  const [comments, setComments] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [pincode, setPincode] = useState('')
  const [uploadedAttachment, setUploadedAttachment] = useState<UploadedFileInfo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isCommunicationRoute = location.pathname.startsWith('/communication/')

  const resetAttachment = useCallback(() => setUploadedAttachment(null), [])

  const loadNdrEvents = useCallback(async () => {
    try {
      setLoading(true)
      const resp = await fetchMyNdr({
        page,
        limit: rowsPerPage,
        search: searchValue || undefined,
      })
      setRows(resp?.data || [])
      setTotalCount(resp?.totalCount || 0)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      toast.open({
        message: error?.response?.data?.message || error?.message || 'Failed to load NDR events',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, searchValue])

  useEffect(() => {
    if (!isCommunicationRoute) {
      loadNdrEvents()
    }
  }, [isCommunicationRoute, loadNdrEvents])

  const tableRows = useMemo(() => rows, [rows])

  const openTimeline = async (row: NdrRow) => {
    try {
      setSelectedAwb(row.awb_number || null)
      const resp = await fetchMyNdrTimeline({
        awb: row.awb_number,
        orderId: row.order_id,
      })
      const timelineData = resp?.data || null
      const events = Array.isArray(timelineData?.events) ? timelineData.events : []
      const keys: string[] = Array.from(
        new Set(
          events
            .map((event: TimelineEvent) => event?.attachment_key)
            .filter((key: string | null | undefined): key is string => Boolean(key)),
        ),
      )

      if (keys.length) {
        try {
          const urls = await getPresignedDownloadUrls(keys)
          const urlMap = new Map<string, string>()
          keys.forEach((key, index) => urlMap.set(key, urls?.[index] || ''))
          timelineData.events = events.map((event: TimelineEvent) => ({
            ...event,
            attachment_url: event.attachment_key ? urlMap.get(event.attachment_key) || null : null,
          }))
        } catch {
          timelineData.events = events.map((event: TimelineEvent) => ({
            ...event,
            attachment_url: null,
          }))
        }
      }

      setTimeline(timelineData)
      setTimelineOpen(true)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.open({
        message: error?.response?.data?.message || 'Failed to load timeline',
        severity: 'error',
      })
    }
  }

  if (isCommunicationRoute) {
    return (
      <div className="communication-shell">
        <div className="col-md-12">
          <div className="com-links s465465465">
            <ul>
              {communicationTabs.map((tab) => (
                <li key={tab.path}>
                  <NavLink className={({ isActive }) => `active ${isActive ? 'activekkkkk' : ''}`.trim()} to={tab.path}>
                    {tab.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="filterration filzd hist">
            <div className="wrapperdz-filtz">
              <div className="wrapper-filter">
                <label className="calendar-label padding">Search Type</label>
                <input className="mini-input" value="Tracking ID" readOnly />
                <textarea className="mini-textarea" placeholder="Search Here..." />
              </div>
              <div className="mid-divcalender pendingg">
                <label className="calendar-label padding">Select Date</label>
                <ParcelXDateRangePicker
                  value={dateRange}
                  onApply={setDateRange}
                  placeholder="Select Date Range"
                  wrapperClassName="date-wrapper"
                  inputClassName="custom-range-picker mini-input w-240"
                />
              </div>
              <div className="channel report">
                <label className="calendar-label padding">NDR Types</label>
                <input className="mini-input" placeholder="Select NDR Type" readOnly />
              </div>
              <div className="channel report">
                <label className="calendar-label padding">Reattempt</label>
                <input className="mini-input" placeholder="Select Reattempt" readOnly />
              </div>
              <div className="channel">
                <label className="calendar-label padding">Channels</label>
                <input className="mini-input" placeholder="Select Channel" readOnly />
              </div>
              <div className="wrapperz-button">
                <button className="search">Search</button>
                <button className="search">Reset</button>
              </div>
            </div>
          </div>

          <div className="tickets-table pand">
            <div className="summary-actions">
              <div className="warpper___001565">
                <h3>Communication NDR</h3>
                <span className="summary-text ms-2">0 Records</span>
              </div>
              <div className="buttons">
                <button className="export-btn">Export</button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="communication-grid-table ndr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order Details</th>
                    <th>Tracking Details</th>
                    <th>Consignee Details</th>
                    <th>Amount</th>
                    <th>Event</th>
                    <th>Re Attempt</th>
                    <th>Action</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={9} className="empty-cell">No data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Box sx={{ p: '18px 18px 28px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Stack spacing={1.6}>
        {isCommunicationRoute ? (
          <>
            <Box sx={{ ...cardSx, p: '16px 18px' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                <Typography sx={{ fontSize: '1.36rem', fontWeight: 600, color: '#1f252d' }}>
                  Communication Module
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#4b5563' }}>
                    Communication Balance :
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: brand.accent }}>
                    Rs 0.00
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ ...cardSx, p: '14px 16px' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {communicationTabs.map((tab) => {
                  const active = location.pathname === tab.path
                  return (
                    <Button
                      key={tab.path}
                      component={NavLink}
                      to={tab.path}
                      sx={{
                        minHeight: 38,
                        px: 1.55,
                        borderRadius: '999px',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: active ? 700 : 600,
                        color: active ? '#fff' : '#425062',
                        background: active ? '#111' : '#f5f7fa',
                        border: '1px solid #ece9f1',
                      }}
                    >
                      {tab.label}
                    </Button>
                  )
                })}
              </Box>
            </Box>
          </>
        ) : null}

        <Box sx={{ ...cardSx, p: '14px 16px 16px' }}>
          <Stack
            direction={{ xs: 'column', xl: 'row' }}
            spacing={1.25}
            flexWrap="wrap"
            useFlexGap
            alignItems={{ xl: 'flex-end' }}
          >
            <Box sx={{ minWidth: 180 }}>
              <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                Date Filter Type
              </Typography>
              <TextField
                select
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                sx={fieldSx}
              >
                {['First NDR Date', 'Last NDR Date', 'Placed Date'].map((option) => (
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
                    minWidth: 130,
                    '& .MuiOutlinedInput-root': {
                      ...fieldSx['& .MuiOutlinedInput-root'],
                      borderRadius: '8px 0 0 8px',
                    },
                  }}
                >
                  {['Order ID', 'Tracking ID', 'Reason'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search by Order ID"
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
                onClick={() => loadNdrEvents()}
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
                onClick={() => {
                  setSearchType('Order ID')
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

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {issueTabs.map((label) => (
              <Button
                key={label}
                sx={{
                  minWidth: 118,
                  minHeight: 54,
                  px: 1.2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  border: '1px solid #ece9f1',
                  background: '#fff',
                  color: '#2f3946',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.1,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>0</span>
                <span style={{ fontWeight: 600, fontSize: '0.72rem', lineHeight: 1.2 }}>{label}</span>
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ ...cardSx, p: '14px 16px 16px' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.4 }}>
            {recordTabs.map((tab, index) => {
              const active = recordTab === tab || (!recordTab && index === 0)
              return (
                <Button
                  key={tab}
                  onClick={() => setRecordTab(tab)}
                  sx={{
                    minHeight: 38,
                    px: 1.6,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: active ? 700 : 600,
                    background: active ? '#111' : '#f5f7fa',
                    color: active ? '#fff' : '#425062',
                    border: '1px solid #ece9f1',
                  }}
                >
                  {tab}
                </Button>
              )
            })}
          </Box>

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            spacing={1.2}
            sx={{ mb: 1.25 }}
          >
            <Typography sx={{ fontSize: '1.22rem', fontWeight: 600, color: '#20262d' }}>
              {isCommunicationRoute ? 'Communication NDR Records' : 'All NDR Records'}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                sx={{
                  minHeight: 40,
                  px: 1.8,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid #d8dde5',
                  color: '#27303f',
                  background: '#fff',
                }}
              >
                Bulk NDR Action
              </Button>
              <Button
                sx={{
                  minHeight: 40,
                  px: 1.8,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid #d8dde5',
                  color: '#27303f',
                  background: '#fff',
                }}
              >
                Export
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mb: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.82rem', color: '#232c39' }}>Item Per Page:</Typography>
              <TextField select value="50" sx={{ ...fieldSx, width: 78 }}>
                <MenuItem value="50">50</MenuItem>
              </TextField>
            </Stack>
            <Typography sx={{ fontSize: '0.81rem', color: '#8a93a1' }}>1</Typography>
          </Box>

          <TableContainer sx={{ background: '#f8fafc' }}>
            <Table sx={{ minWidth: 2200 }}>
              <TableHead>
                <TableRow sx={{ background: '#fff' }}>
                  {[
                    'Pickup Details',
                    'Client Order ID',
                    'Tracking Details',
                    'Product Details',
                    'Amount Details',
                    'Address',
                    'User Contact',
                    'NDR Remark',
                    'Current Location & Time',
                    'Status',
                    'Consignee Remark Whatsapp',
                    'Consignee Remark Email',
                    'Consignee Remark SMS',
                    'Action',
                  ].map((column) => (
                    <TableCell
                      key={column}
                      sx={{
                        py: 1.55,
                        px: 1.7,
                        borderBottom: '1px solid #edf0f4',
                        color: '#2d3748',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        fontFamily: 'Instrument Sans, sans-serif',
                        whiteSpace: 'nowrap',
                        background: '#fff',
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow sx={{ background: '#fff' }}>
                    <TableCell colSpan={14} sx={{ py: 4, textAlign: 'center', color: '#6e7784' }}>
                      Loading NDR shipments...
                    </TableCell>
                  </TableRow>
                ) : tableRows.length ? (
                  tableRows.map((row, index) => (
                    <TableRow key={row.id || row.awb_number || index} sx={{ background: index % 2 === 0 ? '#fff' : '#fffaf7' }}>
                      <TableCell>{row.courier_partner || '--'}</TableCell>
                      <TableCell>{row.order_id || '--'}</TableCell>
                      <TableCell>{row.awb_number || '--'}</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>{row.reason || row.remarks || '--'}</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>{row.status || '--'}</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                          <Button size="small" variant="outlined" onClick={() => openTimeline(row)}>
                            Timeline
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              setSelectedAwb(row.awb_number || null)
                              setNextAttemptDate('')
                              setComments('')
                              resetAttachment()
                              setReattemptOpen(true)
                            }}
                          >
                            Reattempt
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedAwb(row.awb_number || null)
                              setPhone('')
                              resetAttachment()
                              setChangePhoneOpen(true)
                            }}
                          >
                            Change Phone
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedAwb(row.awb_number || null)
                              setName('')
                              setAddress1('')
                              setAddress2('')
                              setPincode('')
                              resetAttachment()
                              setChangeAddressOpen(true)
                            }}
                          >
                            Change Address
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow sx={{ background: '#fff' }}>
                    <TableCell
                      colSpan={14}
                      sx={{
                        py: 5.5,
                        textAlign: 'center',
                        color: '#6e7784',
                        fontSize: '0.88rem',
                        fontFamily: 'Instrument Sans, sans-serif',
                        borderBottom: 'none',
                      }}
                    >
                      No NDR shipments found. Try adjusting filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 1.35, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.82rem', color: '#232c39' }}>Item Per Page:</Typography>
              <TextField select value="50" sx={{ ...fieldSx, width: 78 }}>
                <MenuItem value="50">50</MenuItem>
              </TextField>
            </Stack>
            <Typography sx={{ fontSize: '0.81rem', color: '#8a93a1' }}>1</Typography>
          </Box>
        </Box>
      </Stack>

      <Dialog open={timelineOpen} onClose={() => setTimelineOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>NDR Timeline</DialogTitle>
        <DialogContent>
          <Stack gap={1} mt={1}>
            {(timeline?.events || []).map((event, idx) => (
              <Stack key={idx} gap={0.35} borderLeft="2px solid #E2E8F0" pl={1}>
                <Typography variant="caption" color="text.secondary">
                  {event?.at ? new Date(event.at).toLocaleString() : '--'}
                </Typography>
                <Typography variant="body2">{event?.status || '--'}</Typography>
                {event?.remarks ? (
                  <Typography variant="caption" color="text.secondary">
                    {event.remarks}
                  </Typography>
                ) : null}
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimelineOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reattemptOpen} onClose={() => setReattemptOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Request Reattempt</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <CustomInput label="AWB" value={selectedAwb || ''} disabled topMargin={false} />
            <CustomInput
              label="Next Attempt Date"
              type="date"
              value={nextAttemptDate}
              onChange={(e) => setNextAttemptDate((e.target as HTMLInputElement).value)}
            />
            <CustomInput
              label="Comments"
              value={comments}
              placeholder="Add a note (optional)"
              onChange={(e) => setComments((e.target as HTMLInputElement).value)}
            />
            <FileUploader
              multiple={false}
              maxSizeMb={15}
              accept="audio/*,image/*,.mp3,.wav,.m4a,.aac,.ogg,.jpg,.jpeg,.png,.webp"
              folderKey="ndr-actions"
              onUploaded={(files) => setUploadedAttachment(files?.[0] || null)}
              label="Upload recording or image"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReattemptOpen(false)} disabled={submitting}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedAwb || !nextAttemptDate || submitting}
            onClick={async () => {
              try {
                setSubmitting(true)
                await submitNdrReattempt({
                  awb: selectedAwb || undefined,
                  nextAttemptDate,
                  comments,
                  attachmentKey: uploadedAttachment?.key,
                  attachmentName: uploadedAttachment?.originalName,
                  attachmentMime: uploadedAttachment?.mime,
                })
                toast.open({ message: 'Reattempt requested successfully', severity: 'success' })
                setReattemptOpen(false)
                resetAttachment()
                await loadNdrEvents()
              } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } }; message?: string }
                toast.open({
                  message: error?.response?.data?.message || error?.message || 'Failed to request reattempt',
                  severity: 'error',
                })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={changePhoneOpen} onClose={() => setChangePhoneOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Phone</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <CustomInput label="AWB" value={selectedAwb || ''} disabled topMargin={false} />
            <CustomInput label="New Phone" value={phone} onChange={(e) => setPhone((e.target as HTMLInputElement).value)} />
            <FileUploader
              multiple={false}
              maxSizeMb={15}
              accept="audio/*,image/*,.mp3,.wav,.m4a,.aac,.ogg,.jpg,.jpeg,.png,.webp"
              folderKey="ndr-actions"
              onUploaded={(files) => setUploadedAttachment(files?.[0] || null)}
              label="Upload recording or image"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePhoneOpen(false)} disabled={submitting}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedAwb || !phone || submitting}
            onClick={async () => {
              try {
                setSubmitting(true)
                await submitNdrChangePhone({
                  awb: selectedAwb || undefined,
                  phone,
                  attachmentKey: uploadedAttachment?.key,
                  attachmentName: uploadedAttachment?.originalName,
                  attachmentMime: uploadedAttachment?.mime,
                })
                toast.open({ message: 'Phone update submitted successfully', severity: 'success' })
                setChangePhoneOpen(false)
                resetAttachment()
              } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } }; message?: string }
                toast.open({
                  message: error?.response?.data?.message || error?.message || 'Failed to submit phone update',
                  severity: 'error',
                })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={changeAddressOpen} onClose={() => setChangeAddressOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Address</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <CustomInput label="AWB" value={selectedAwb || ''} disabled topMargin={false} />
            <CustomInput label="Consignee Name" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
            <CustomInput label="Address Line 1" value={address1} onChange={(e) => setAddress1((e.target as HTMLInputElement).value)} />
            <CustomInput label="Address Line 2" value={address2} onChange={(e) => setAddress2((e.target as HTMLInputElement).value)} />
            <CustomInput label="Pincode" value={pincode} onChange={(e) => setPincode((e.target as HTMLInputElement).value)} />
            <FileUploader
              multiple={false}
              maxSizeMb={15}
              accept="audio/*,image/*,.mp3,.wav,.m4a,.aac,.ogg,.jpg,.jpeg,.png,.webp"
              folderKey="ndr-actions"
              onUploaded={(files) => setUploadedAttachment(files?.[0] || null)}
              label="Upload recording or image"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeAddressOpen(false)} disabled={submitting}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedAwb || !address1 || !pincode || submitting}
            onClick={async () => {
              try {
                setSubmitting(true)
                await submitNdrChangeAddress({
                  awb: selectedAwb || undefined,
                  name,
                  address_1: address1,
                  address_2: address2,
                  pincode,
                  attachmentKey: uploadedAttachment?.key,
                  attachmentName: uploadedAttachment?.originalName,
                  attachmentMime: uploadedAttachment?.mime,
                })
                toast.open({ message: 'Address update submitted successfully', severity: 'success' })
                setChangeAddressOpen(false)
                resetAttachment()
              } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } }; message?: string }
                toast.open({
                  message: error?.response?.data?.message || error?.message || 'Failed to submit address update',
                  severity: 'error',
                })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
