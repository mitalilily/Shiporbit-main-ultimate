import {
  alpha,
  Box,
  Button,
  Checkbox,
  Divider,
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
import { useMemo, useRef, useState } from 'react'
import {
  FiChevronDown,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiUpload,
} from 'react-icons/fi'
import { downloadCustomReportCsv } from '../../api/reports.api'
import ParcelXDateRangePicker, { getDefaultRange, type RangeValue } from '../../components/UI/inputs/ParcelXDateRangePicker'
import { toast } from '../../components/UI/Toast'
import { brand } from '../../theme/brand'

type ReportField = {
  key: string
  label: string
}

type ReportGroup = {
  title: string
  fields: ReportField[]
}

const reportGroups: ReportGroup[] = [
  {
    title: 'Weight Details',
    fields: [
      { key: 'length_breadth_height', label: 'Length x Breadth x Height' },
      { key: 'item_weight', label: 'Item Weight' },
      { key: 'volumetric_dimensions', label: 'Volumetric Dimensions' },
      { key: 'charged_weight', label: 'Charged Weight' },
      { key: 'updated_weight', label: 'Updated Weight' },
    ],
  },
  {
    title: 'Master / Child details',
    fields: [
      { key: 'is_mps', label: 'Is MPS?' },
      { key: 'master_child_status', label: 'Master / Child status' },
      { key: 'master_child_waybill', label: 'Master / child waybill' },
      { key: 'dimension_weight', label: 'Dimension and Weight' },
      { key: 'child_waybill_count', label: 'Number of child waybills' },
    ],
  },
  {
    title: 'Shipment event Dates',
    fields: [
      { key: 'first_attempt_date', label: 'First Attempt Date' },
      { key: 'last_attempt_date', label: 'Last Attempt Date' },
      { key: 'rto_marked_date', label: 'RTO Marked Date' },
      { key: 'rto_delivered_date', label: 'RTO Delivered Date' },
      { key: 'first_ndr_remark', label: 'First NDR Remark' },
      { key: 'last_ndr_remark', label: 'Last NDR Remark' },
    ],
  },
  {
    title: 'Others',
    fields: [
      { key: 'is_ndd', label: 'Is NDD' },
      { key: 'zone', label: 'Zone' },
      { key: 'delivery_tat', label: 'Delivery TAT' },
      { key: 'rto_reason', label: 'RTO Reason' },
      { key: 'attempt_counts', label: 'Attempt Counts' },
      { key: 'cod_trn', label: 'COD TRN' },
      { key: 'shipping_charges', label: 'Shipping Charges' },
    ],
  },
]

const defaultFields = reportGroups.flatMap((group) => group.fields.map((field) => field.key))

const statusTabs = [
  'ALL (0)',
  'Booked (0)',
  'Manifested (0)',
  'Picked (0)',
  'In Transit (0)',
  'Dispatched (0)',
  'NDR (0)',
  'Delivered (0)',
  'RTO (0)',
  'RTS (0)',
  'Cancelled (0)',
  'Lost (0)',
]

const tableColumns = [
  'Order Details',
  'Tracking Details',
  'Product Details',
  'Amount Detail',
  'Status',
  'Pickup Address',
  'Consignee Address',
  'Contact',
]

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
    py: 1.15,
  },
}

const reportButtonSx = {
  minHeight: 40,
  borderRadius: '10px',
  px: 1.6,
  textTransform: 'none',
  fontSize: '0.82rem',
  fontWeight: 600,
  fontFamily: 'Instrument Sans, sans-serif',
  border: '1px solid #ece9f1',
  color: '#27303f',
  background: '#fff',
  boxShadow: 'none',
}

const cardSx = {
  background: '#fff',
  border: '1px solid #ece9f1',
  borderRadius: '14px',
  boxShadow: 'none',
}

export default function Reports() {
  const [dateRange, setDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [dateType, setDateType] = useState('Placed')
  const [expressType, setExpressType] = useState('')
  const [shipmentType, setShipmentType] = useState('')
  const [insurance, setInsurance] = useState('')
  const [searchType, setSearchType] = useState('Tracking ID')
  const [searchValue, setSearchValue] = useState('')
  const [tableSearch, setTableSearch] = useState('')
  const [itemPerPage] = useState('500')
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [allChecked, setAllChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const toggleAll = () => {
    setAllChecked((prev) => {
      const next = !prev
      setSelectedFields(next ? defaultFields : [])
      return next
    })
  }

  const toggleField = (key: string) => {
    setSelectedFields((prev) => {
      const next = prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
      setAllChecked(next.length === defaultFields.length)
      return next
    })
  }

  const visibleSelectedCount = useMemo(() => selectedFields.length, [selectedFields])

  const handleDownload = async () => {
    if (!selectedFields.length) {
      toast.open({ message: 'Please select at least one report field.', severity: 'warning' })
      return
    }

    setSubmitting(true)
    try {
      const blob = await downloadCustomReportCsv({
        fromDate: '2026-04-17',
        toDate: '2026-04-17',
        selectedFields,
      })
      const fileName = 'custom_report_2026-04-17_to_2026-04-17.csv'
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(url)
      toast.open({ message: 'Report downloaded', severity: 'success' })
    } catch {
      toast.open({ message: 'Failed to download report', severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ p: '18px 18px 28px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Stack spacing={1.6}>
        <Box
          className="top___report miss-report top___component"
          sx={{
            ...cardSx,
            p: '14px 16px',
          }}
        >
          <Stack
            direction={{ xs: 'column', xl: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', xl: 'center' }}
            spacing={1.2}
          >
            <Box className="top____heading">
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#24292f',
                }}
              >
                Reports Builder
              </Typography>
              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: '0.8rem',
                  color: '#707a89',
                }}
              >
                Selected fields: {visibleSelectedCount}
              </Typography>
            </Box>

            <Stack
              className="top___component__right"
              direction={{ xs: 'column', lg: 'row' }}
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              alignItems={{ lg: 'center' }}
            >
              <Button sx={reportButtonSx} startIcon={<FiDownload />} onClick={handleDownload}>
                Download Sample File
              </Button>

              <input ref={fileInputRef} type="file" hidden />
              <Button
                sx={reportButtonSx}
                startIcon={<FiUpload size={16} />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload
              </Button>

              <Button
                disabled={submitting}
                onClick={handleDownload}
                sx={{
                  ...reportButtonSx,
                  background: brand.accent,
                  color: '#fff',
                  borderColor: brand.accent,
                  '&.Mui-disabled': {
                    color: '#fff',
                    background: alpha(brand.accent, 0.55),
                  },
                }}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>

              <Button
                sx={reportButtonSx}
                startIcon={<FiFilter />}
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
              >
                {showAdvancedFilters ? 'Hide Advance Filters' : 'Show Advance Filters'}
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1.5 }}>
          <Checkbox checked={allChecked} onChange={toggleAll} sx={{ p: 0.5, mr: 0.8 }} />
          <Typography sx={{ fontSize: '0.84rem', fontWeight: 500, color: '#232b36' }}>
            Select All
          </Typography>
        </Box>

        <Box
          className="report____warrpped"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
            gap: 1.5,
          }}
        >
          {reportGroups.map((group) => (
            <Box
              key={group.title}
              className="report-wrapper"
              sx={{
                ...cardSx,
                p: '14px 16px 16px',
              }}
            >
              <Box className="report-heading" sx={{ mb: 1.1 }}>
                <Typography sx={{ fontSize: '0.98rem', fontWeight: 700, color: '#252c35' }}>
                  {group.title}
                </Typography>
              </Box>

              <Stack spacing={0.35}>
                {group.fields.map((field) => (
                  <Box key={field.key} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedFields.includes(field.key)}
                      onChange={() => toggleField(field.key)}
                      sx={{ p: 0.5, mr: 0.9 }}
                    />
                    <Typography sx={{ fontSize: '0.82rem', color: '#3b4452', fontWeight: 500 }}>
                      {field.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        {showAdvancedFilters ? (
          <Box
            className="filterration report report-filter mb-3"
            sx={{
              ...cardSx,
              p: '14px 16px 16px',
            }}
          >
            <Stack
              className="wrapperdz-filtz mis-report"
              direction={{ xs: 'column', xl: 'row' }}
              flexWrap="wrap"
              useFlexGap
              spacing={1.25}
              alignItems={{ xl: 'flex-end' }}
            >
              <Box sx={{ minWidth: 160 }}>
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
                  {['Placed', 'Picked', 'Delivered', 'RTS'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ minWidth: 300 }}>
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
                  Express Type
                </Typography>
                <TextField
                  select
                  value={expressType}
                  onChange={(e) => setExpressType(e.target.value)}
                  sx={fieldSx}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Air">Air</MenuItem>
                  <MenuItem value="Surface">Surface</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ minWidth: 150 }}>
                <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                  Shipment Type
                </Typography>
                <TextField
                  select
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value)}
                  sx={fieldSx}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Forward">Forward</MenuItem>
                  <MenuItem value="Reverse">Reverse</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ minWidth: 130 }}>
                <Typography sx={{ fontSize: '0.77rem', fontWeight: 500, color: '#111', mb: 0.55 }}>
                  Insurance
                </Typography>
                <TextField
                  select
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  sx={fieldSx}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ minWidth: 300, flex: 1 }}>
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
                    SelectProps={{ IconComponent: FiChevronDown }}
                  >
                    {['Tracking ID', 'Order ID', 'Product Name', 'Product SKU'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="search here"
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
                    setDateType('Placed')
                    setExpressType('')
                    setShipmentType('')
                    setInsurance('')
                    setSearchType('Tracking ID')
                    setSearchValue('')
                  }}
                  sx={{
                    ...reportButtonSx,
                    minHeight: 40,
                    borderRadius: '8px',
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : null}

        <Box>
          <Box
            className="com-links s465465465 mis-report"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 1.6,
            }}
          >
            {statusTabs.map((tab, index) => {
              const active = index === 0
              return (
                <Button
                  key={tab}
                  sx={{
                    minHeight: 38,
                    px: 1.55,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: active ? 700 : 600,
                    background: active ? '#111' : '#fff',
                    color: active ? '#fff' : '#425062',
                    border: '1px solid #ece9f1',
                    boxShadow: 'none',
                  }}
                >
                  {tab}
                </Button>
              )
            })}
          </Box>
        </Box>

        <Box
          className="tickets-table pand"
          sx={{
            ...cardSx,
            overflow: 'hidden',
          }}
        >
          <Box className="header-container" sx={{ p: '16px 18px 12px' }}>
            <Stack
              className="summary-actions"
              direction={{ xs: 'column', xl: 'row' }}
              justifyContent="space-between"
              spacing={1.2}
            >
              <Box className="top____heading">
                <Typography sx={{ fontSize: '1.32rem', fontWeight: 600, color: '#1f252d' }}>
                  All
                </Typography>
              </Box>

              <Stack
                className="buttons buton_000111444"
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                <TextField
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search records..."
                  sx={{
                    ...fieldSx,
                    minWidth: 260,
                  }}
                />
                <Button sx={reportButtonSx} startIcon={<FiDownload size={18} />}>
                  Export
                </Button>
              </Stack>
            </Stack>

            <Stack
              className="pagination-container mt-0"
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={1}
              sx={{ mt: 1.3 }}
            >
              <Stack className="warpped-peg mt-0" direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '0.82rem', color: '#232c39' }}>Item Per Page:</Typography>
                <TextField
                  select
                  value={itemPerPage}
                  sx={{
                    ...fieldSx,
                    width: 78,
                  }}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="500">500</MenuItem>
                </TextField>
              </Stack>
              <Typography sx={{ fontSize: '0.81rem', color: '#8a93a1' }}>1</Typography>
            </Stack>
          </Box>

          <Divider />

          <Box className="tickets_table report">
            <Box className="table-body report report-analysis" sx={{ background: '#f8fafc' }}>
              <TableContainer>
                <Table sx={{ minWidth: 1230, tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow sx={{ background: '#fff' }}>
                      {tableColumns.map((column) => (
                        <TableCell
                          key={column}
                          sx={{
                            py: 1.6,
                            px: 2,
                            borderBottom: '1px solid #edf0f4',
                            color: brand.accent,
                            fontSize: '0.83rem',
                            fontWeight: 700,
                            fontFamily: 'Instrument Sans, sans-serif',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Stack direction="row" spacing={0.6} alignItems="center">
                            <span>{column}</span>
                            {column !== 'Product Details' && column !== 'Consignee Address' && column !== 'Contact' ? (
                              <FiFilter size={14} color={brand.accent} />
                            ) : null}
                          </Stack>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ background: '#fff' }}>
                      <TableCell
                        colSpan={tableColumns.length}
                        sx={{
                          py: 5.5,
                          textAlign: 'center',
                          color: '#6e7784',
                          fontSize: '0.88rem',
                          fontFamily: 'Instrument Sans, sans-serif',
                          borderBottom: 'none',
                        }}
                      >
                        No records found. Try adjusting filters.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <Box className="pagination-container" sx={{ px: 2.25, pb: 2, pt: 1.2 }}>
            <Stack
              className="warpped-peg"
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '0.82rem', color: '#232c39' }}>Item Per Page:</Typography>
                <TextField
                  select
                  value={itemPerPage}
                  sx={{
                    ...fieldSx,
                    width: 78,
                  }}
                  SelectProps={{ IconComponent: FiChevronDown }}
                >
                  <MenuItem value="500">500</MenuItem>
                </TextField>
              </Stack>

              <Typography sx={{ fontSize: '0.81rem', color: '#8a93a1' }}>1</Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
