import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Pagination,
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
import { FiChevronDown, FiDownload, FiRefreshCw, FiSearch, FiUpload } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import ParcelXDateRangePicker, { getDefaultRange, type RangeValue } from '../../components/UI/inputs/ParcelXDateRangePicker'
import { toast } from '../../components/UI/Toast'
import { useWalletTransactions } from '../../hooks/useWalletBalance'
import { brand } from '../../theme/brand'

interface WalletFilter {
  type?: 'credit' | 'debit' | ''
  reason?: string
  dateFrom?: string
  dateTo?: string
}

const topTabs = [
  { label: 'Wallet Deduction', path: '/wallet/wallet_deduction' },
  { label: 'Recharge History', path: '/wallet/rechargehistory' },
  { label: 'Add Money', path: '/wallet/addmoney' },
]

const dateTypeOptions = [
  { label: 'Transaction', value: 'transaction' },
  { label: 'Created', value: 'created' },
]

const searchTypeOptions = [
  { label: 'tracking_id', value: 'tracking_id' },
  { label: 'order_number', value: 'order_number' },
  { label: 'reference', value: 'reference' },
]

const communicationTabs = [
  { label: 'Credit Recharge', path: '/communication/credit_recharge' },
  { label: 'Recharge History', path: '/communication/recharge_history' },
  { label: 'Notification Setting', path: '/communication/notificationsetting' },
  { label: 'Notification History', path: '/communication/notification-history' },
  { label: 'Ledger', path: '/communication/ladger' },
  { label: 'NDR', path: '/communication/ndr' },
  { label: 'Channels and Price', path: '/communication/channelpricing' },
]

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 40,
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.82rem',
    '& fieldset': { borderColor: '#e8ebec' },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.82rem',
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.78rem',
    color: '#111',
    fontWeight: 500,
  },
}

const formatDateTime = (value?: string) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatMoney = (value: unknown) => `Rs ${Number(value || 0).toFixed(2)}`

const notificationSettingRows = [
  { event: 'Packed', sms: '0.2', email: '0.1', whatsapp: '1', ivr: '-' },
  { event: 'Pick up', sms: 'FREE', email: 'FREE', whatsapp: '1', ivr: '-' },
  { event: 'Shipped (In Transit)', sms: '0.2', email: '0.1', whatsapp: '1', ivr: '-' },
  { event: 'Out for Delivery', sms: '0.2', email: '0.1', whatsapp: '1', ivr: '-' },
  { event: 'Delivered', sms: 'FREE', email: 'FREE', whatsapp: '1', ivr: '-' },
  { event: 'Draft Order', sms: '-', email: '-', whatsapp: '1', ivr: '0.9' },
]

const channelPricingRows = [
  { id: 1, channel: 'SMS', credits: '₹ 0.20' },
  { id: 2, channel: 'Email', credits: '₹ 0.10' },
  { id: 3, channel: 'WhatsApp', credits: '₹ 1.00' },
  { id: 4, channel: 'IVR', credits: '₹ 0.90' },
]

const notificationCategories = ['Order Status', 'NDR', 'Channel Order Confirmation', 'Other Notifications'] as const
type NotificationCategory = (typeof notificationCategories)[number]
type NotificationChannel = 'sms' | 'email' | 'whatsapp' | 'ivr'

type CommunicationRechargeRow = {
  id: number
  createdAt: string
  amount: number
  credits: number
  status: 'Success' | 'Pending' | 'Failed'
  reference: string
  channel: string
}

type NotificationHistoryRow = {
  id: number
  medium: 'SMS' | 'Email' | 'WhatsApp' | 'IVR'
  orderId: string
  trackingId: string
  consignee: string
  eventCategory: NotificationCategory
  eventName: string
  status: 'Sent' | 'Queued' | 'Failed'
  credits: string
  at: string
}

type LedgerRow = {
  id: number
  orderId: string
  trackingId: string
  event: string
  transaction: string
  action: 'Debit' | 'Credit'
  channel: string
  at: string
}

const communicationRechargeRows: CommunicationRechargeRow[] = [
  { id: 1, createdAt: '2026-04-18T10:14:00.000Z', amount: 5000, credits: 5000, status: 'Success', reference: 'COM-784211', channel: 'All Channels' },
  { id: 2, createdAt: '2026-04-11T08:42:00.000Z', amount: 2500, credits: 2500, status: 'Pending', reference: 'COM-781992', channel: 'WhatsApp' },
  { id: 3, createdAt: '2026-04-02T13:20:00.000Z', amount: 1800, credits: 1800, status: 'Success', reference: 'COM-778431', channel: 'SMS' },
]

const notificationHistoryRows: NotificationHistoryRow[] = [
  { id: 1, medium: 'SMS', orderId: 'ORD-29812', trackingId: 'TRK734822', consignee: 'Aarav Sharma', eventCategory: 'Order Status', eventName: 'Shipped', status: 'Sent', credits: '0.20', at: '2026-04-20T09:48:00.000Z' },
  { id: 2, medium: 'Email', orderId: 'ORD-29813', trackingId: 'TRK734901', consignee: 'Riya Verma', eventCategory: 'NDR', eventName: 'NDR Created', status: 'Queued', credits: '0.10', at: '2026-04-20T11:12:00.000Z' },
  { id: 3, medium: 'WhatsApp', orderId: 'ORD-29817', trackingId: 'TRK735104', consignee: 'Kabir Mehta', eventCategory: 'Channel Order Confirmation', eventName: 'Order Confirmed', status: 'Sent', credits: '1.00', at: '2026-04-19T16:02:00.000Z' },
  { id: 4, medium: 'IVR', orderId: 'ORD-29788', trackingId: 'TRK733612', consignee: 'Anaya Kapoor', eventCategory: 'Other Notifications', eventName: 'COD Reminder', status: 'Failed', credits: '0.90', at: '2026-04-17T14:35:00.000Z' },
]

const ledgerRows: LedgerRow[] = [
  { id: 1, orderId: 'ORD-29812', trackingId: 'TRK734822', event: 'Shipped SMS', transaction: 'TXN-COM-6112', action: 'Debit', channel: 'SMS', at: '2026-04-20T09:48:00.000Z' },
  { id: 2, orderId: 'ORD-29813', trackingId: 'TRK734901', event: 'NDR Email', transaction: 'TXN-COM-6121', action: 'Debit', channel: 'Email', at: '2026-04-20T11:12:00.000Z' },
  { id: 3, orderId: 'ORD-29817', trackingId: 'TRK735104', event: 'Confirmation WhatsApp', transaction: 'TXN-COM-6134', action: 'Debit', channel: 'WhatsApp', at: '2026-04-19T16:02:00.000Z' },
]

const downloadCsv = (filename: string, headers: string[], rows: Array<Array<string | number>>) => {
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function WalletTransactions() {
  const location = useLocation()
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [dateType, setDateType] = useState('transaction')
  const [searchType, setSearchType] = useState('tracking_id')
  const [searchValue, setSearchValue] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [rechargeAmount, setRechargeAmount] = useState('0')
  const [filters, setFilters] = useState<WalletFilter>({})
  const [commRechargeSearch, setCommRechargeSearch] = useState('')
  const [commRechargeStatus, setCommRechargeStatus] = useState('All')
  const [commRechargeDateRange, setCommRechargeDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [settingCategory, setSettingCategory] = useState<NotificationCategory>('Order Status')
  const [notificationChannels, setNotificationChannels] = useState<'All' | 'SMS' | 'Email' | 'WhatsApp' | 'IVR'>('All')
  const [notificationSearchFor, setNotificationSearchFor] = useState('Order Updates')
  const [notificationSearchType, setNotificationSearchType] = useState('Tracking ID')
  const [notificationSearchText, setNotificationSearchText] = useState('')
  const [notificationEventCategory, setNotificationEventCategory] = useState('All')
  const [notificationEventName, setNotificationEventName] = useState('All')
  const [notificationDateRange, setNotificationDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [ledgerSearchType, setLedgerSearchType] = useState('Tracking ID')
  const [ledgerSearchText, setLedgerSearchText] = useState('')
  const [ledgerAction, setLedgerAction] = useState('All')
  const [ledgerChannel, setLedgerChannel] = useState('All')
  const [ledgerDateRange, setLedgerDateRange] = useState<RangeValue>(() => getDefaultRange())
  const [channelToggles, setChannelToggles] = useState<Record<NotificationCategory, Record<string, Record<NotificationChannel, boolean>>>>({
    'Order Status': {
      Packed: { sms: true, email: true, whatsapp: true, ivr: false },
      'Pick up': { sms: true, email: true, whatsapp: true, ivr: false },
      'Shipped (In Transit)': { sms: true, email: true, whatsapp: true, ivr: false },
      'Out for Delivery': { sms: true, email: true, whatsapp: true, ivr: false },
      Delivered: { sms: true, email: true, whatsapp: true, ivr: false },
      'Draft Order': { sms: false, email: false, whatsapp: true, ivr: true },
    },
    NDR: {
      'NDR Created': { sms: true, email: true, whatsapp: false, ivr: false },
      'Customer Reattempt': { sms: true, email: false, whatsapp: true, ivr: false },
    },
    'Channel Order Confirmation': {
      'Shopify Order Sync': { sms: false, email: true, whatsapp: true, ivr: false },
      'WooCommerce Order Sync': { sms: false, email: true, whatsapp: true, ivr: false },
    },
    'Other Notifications': {
      'COD Reminder': { sms: true, email: false, whatsapp: true, ivr: true },
      'Low Wallet Balance': { sms: false, email: true, whatsapp: true, ivr: false },
    },
  })

  const isRechargePage = location.pathname === '/wallet/rechargehistory'
  const isAddMoneyPage = location.pathname === '/wallet/addmoney'
  const isCommunicationPage = location.pathname.startsWith('/communication/')
  const isCommunicationRecharge = location.pathname === '/communication/credit_recharge'
  const isCommunicationRechargeHistory = location.pathname === '/communication/recharge_history'
  const isCommunicationNotificationSetting = location.pathname === '/communication/notificationsetting'
  const isCommunicationNotificationHistory = location.pathname === '/communication/notification-history'
  const isCommunicationLedger = location.pathname === '/communication/ladger'
  const isCommunicationChannelPricing = location.pathname === '/communication/channelpricing'

  const { data, isLoading, isError } = useWalletTransactions({
    limit: 50,
    page,
    type: filters.type || undefined,
    reason: filters.type === 'debit' ? filters.reason || undefined : undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  })

  const transactions = useMemo(() => {
    let rows = data?.transactions ?? []
    if (minAmount) rows = rows.filter((item) => Number(item.amount || 0) >= Number(minAmount))
    if (maxAmount) rows = rows.filter((item) => Number(item.amount || 0) <= Number(maxAmount))
    if (searchValue.trim()) {
      const query = searchValue.trim().toLowerCase()
      rows = rows.filter((item) => {
        if (searchType === 'tracking_id') return String(item.ref || '').toLowerCase().includes(query)
        if (searchType === 'order_number') return String(item.meta?.order_number || '').toLowerCase().includes(query)
        return String(item.reason || '').toLowerCase().includes(query)
      })
    }
    if (isRechargePage) rows = rows.filter((item) => item.type === 'credit')
    if (isAddMoneyPage) rows = rows.filter((item) => item.type === 'credit')
    return rows
  }, [data?.transactions, isAddMoneyPage, isRechargePage, maxAmount, minAmount, searchType, searchValue])

  const totalCount = data?.totalCount ?? transactions.length
  const pageCount = Math.max(1, Math.ceil(totalCount / 50))
  const commRechargeFiltered = useMemo(() => {
    return communicationRechargeRows.filter((row) => {
      const matchesStatus = commRechargeStatus === 'All' || row.status === commRechargeStatus
      const query = commRechargeSearch.trim().toLowerCase()
      const matchesSearch =
        !query ||
        row.reference.toLowerCase().includes(query) ||
        row.channel.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [commRechargeSearch, commRechargeStatus])
  const visibleNotificationRows = useMemo(() => {
    return notificationHistoryRows.filter((row) => {
      const matchesChannel = notificationChannels === 'All' || row.medium === notificationChannels
      const matchesCategory = notificationEventCategory === 'All' || row.eventCategory === notificationEventCategory
      const matchesName = notificationEventName === 'All' || row.eventName === notificationEventName
      const query = notificationSearchText.trim().toLowerCase()
      const matchesSearch =
        !query ||
        row.trackingId.toLowerCase().includes(query) ||
        row.orderId.toLowerCase().includes(query) ||
        row.consignee.toLowerCase().includes(query)
      return matchesChannel && matchesCategory && matchesName && matchesSearch
    })
  }, [notificationChannels, notificationEventCategory, notificationEventName, notificationSearchText])
  const visibleLedgerRows = useMemo(() => {
    return ledgerRows.filter((row) => {
      const matchesAction = ledgerAction === 'All' || row.action === ledgerAction
      const matchesChannel = ledgerChannel === 'All' || row.channel === ledgerChannel
      const query = ledgerSearchText.trim().toLowerCase()
      const matchesSearch =
        !query ||
        row.trackingId.toLowerCase().includes(query) ||
        row.orderId.toLowerCase().includes(query) ||
        row.transaction.toLowerCase().includes(query)
      return matchesAction && matchesChannel && matchesSearch
    })
  }, [ledgerAction, ledgerChannel, ledgerSearchText])
  const notificationSettingData = useMemo(() => {
    return Object.entries(channelToggles[settingCategory]).map(([event, channels]) => ({
      event,
      channels,
    }))
  }, [channelToggles, settingCategory])

  const pageHeading = isRechargePage ? 'View Recharge History' : isAddMoneyPage ? 'Add Money Ledger' : 'View Wallet Deduction'

  const toggleNotificationChannel = (
    category: NotificationCategory,
    eventName: string,
    channel: NotificationChannel,
  ) => {
    setChannelToggles((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [eventName]: {
          ...prev[category][eventName],
          [channel]: !prev[category][eventName][channel],
        },
      },
    }))
  }

  if (isError) {
    return (
      <Typography color="#E74C3C" sx={{ p: 4, textAlign: 'center' }}>
        Error loading wallet data
      </Typography>
    )
  }

  if (isCommunicationPage) {
    return (
      <div className="communication-shell">
        {(isCommunicationRecharge || isCommunicationRechargeHistory) && (
          <div className="warpperzzz">
            <div className="tickets-table pand mb-3">
              <div className="summary-actions wallet mb-0">
                <div className="top____heading"><h2>Communication Module</h2></div>
                <div className="right-wallet"><span className="balance-wallet">Communication Balance :</span><span className="balance-data">₹ 0.00</span></div>
              </div>
            </div>
            <div className="tickets-table recharge history__rech px_communication">
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
              <div className="wallet-main">
                <div className="row">
                  <div className="col-lg-5 order-lg-2 mb-3">
                    <div className="credit_recharge-box">
                      <div className="img-content">
                        <h2>Connect with your audience like never before!</h2>
                        <p>Send SMS, Emails, WhatsApp &amp; IVR calls at unbeatable rates.</p>
                      </div>
                      <img src="/reference/parcelx-login-bg.png" className="img-fluid" alt="wallet communication" />
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="wrapper___card112">
                      <div className="top-wallet border-bottom">
                        <div className="top-wallet-text"><div className="left-wallet">Recharge Your Wallet</div></div>
                        <div className="wrapperz-wallet">
                          <div className="input-wallet">
                            <div className="channel wallet addmoney mb-4">
                              <label htmlFor="channels" className="calendar-label">Enter your amount</label>
                              <input
                                className="ant-input-number-input"
                                placeholder="Enter Amount"
                                value={rechargeAmount}
                                onChange={(e) => setRechargeAmount(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="d-sm-flex align-items-end justify-content-between mb-4">
                          <div className="wallet-instructions">
                            <h2>Instructions</h2>
                            <ul>
                              <li>The minimum amount required is ₹200.</li>
                              <li>This amount will be converted into credits.</li>
                              <li><b>1 Rupee = 1 Credit</b></li>
                            </ul>
                          </div>
                          <div className="payment-method d-flex align-items-center">
                            <span>Powered by</span>
                            <div className="radio-img">Razorpay</div>
                          </div>
                        </div>
                        <div className="submit-payment"><button disabled>Continue to Payment</button></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCommunicationNotificationSetting && (
          <div className="col-md-12">
            <div className="tickets-table pand mb-3 mt-0">
              <div className="summary-actions wallet mb-0">
                <div className="top____heading"><h2>Communication Module</h2></div>
                <div className="right-wallet"><span className="balance-wallet">Communication Balance :</span><span className="balance-data">₹ 0.00</span></div>
              </div>
            </div>
            <div className="com-links s465465465">
              <ul>
                {communicationTabs.map((tab) => (
                  <li key={tab.path}><NavLink className={({ isActive }) => `active ${isActive ? 'activekkkkk' : ''}`.trim()} to={tab.path}>{tab.label}</NavLink></li>
                ))}
              </ul>
            </div>
            <div className="row m-0 mb-3">
              <div className="col-md-8">
                <div className="com-links padding channel_css mb-0">
                  <ul><li className="active">Order Status</li><li>NDR</li><li>Channel Order Confirmation</li><li>Other Notifications</li></ul>
                </div>
              </div>
              <div className="col-md-4"><div className="buttons justify-content-end"><button className="export-btn">Define Brand Identity</button></div></div>
            </div>
            <div className="notification-settingtabel">
              <div className="tickets_table recharge_historty">
                <div className="table-body recharge_historty">
                  <div className="table-responsive">
                    <table className="communication-grid-table">
                      <thead>
                        <tr><th>Events</th><th>SMS</th><th>EMAIL</th><th>WHATSAPP</th><th>IVR</th></tr>
                      </thead>
                      <tbody>
                        {notificationSettingRows.map((row) => (
                          <tr key={row.event}>
                            <td>{row.event}</td>
                            {[row.sms, row.email, row.whatsapp].map((val, idx) => (
                              <td key={`${row.event}-${idx}`}>
                                <div className="d-flex justify-content-between"><div className="switch-wrap"><span className={`switch-dot ${val === 'FREE' ? 'active' : ''}`}></span><span>{val}</span></div><span className="not_0099hhs">i</span></div>
                              </td>
                            ))}
                            <td>{row.ivr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCommunicationNotificationHistory && (
          <div className="col-md-12">
            <div className="com-links s465465465"><ul>{communicationTabs.map((tab) => (<li key={tab.path}><NavLink className={({ isActive }) => `active ${isActive ? 'activekkkkk' : ''}`.trim()} to={tab.path}>{tab.label}</NavLink></li>))}</ul></div>
            <div className="filterration filzd hist">
              <div className="wrapperdz-filtz">
                <div className="channel report"><label className="calendar-label padding">Search For</label><input className="mini-input" value="Order Updates" readOnly /></div>
                <div className="mid-divcalender pendingg"><label className="calendar-label padding">Date</label><input className="mini-input w-240" value="03/01/2026 - 04/19/2026" readOnly /></div>
                <div className="wrapper-filter"><label className="calendar-label padding">Search Type</label><input className="mini-input" value="Tracking ID" readOnly /><input className="mini-input" placeholder="Search Here..." /></div>
                <div className="channel report"><label className="calendar-label padding">Event Category</label><input className="mini-input" placeholder="Select Category" readOnly /></div>
                <div className="channel"><label className="calendar-label padding">Event Name</label><input className="mini-input" placeholder="Select Event Name" readOnly /></div>
                <div className="wrapperz-button"><button className="search">Search</button><button className="search">Reset</button></div>
              </div>
            </div>
            <div className="header-container">
              <div className="summary-actions"><div className="warpper___001565"><h3>Notifications History</h3></div><div className="buttons"><button className="export-btn">Export</button></div></div>
              <div className="com-links padding channel_css"><ul><li><span className="active">SMS</span></li><li><span>Email</span></li><li><span>WhatsApp</span></li><li><span>IVR</span></li><li><span>All</span></li></ul></div>
            </div>
            <div className="tickets-table pand table-responsive">
              <table className="communication-grid-table"><thead><tr><th>#</th><th>Order Details</th><th>Tracking Details</th><th>Consignee Details</th><th>Event</th><th>Status</th><th>Action</th><th>Credits</th></tr></thead><tbody><tr><td colSpan={8} className="empty-cell">No data</td></tr></tbody></table>
            </div>
          </div>
        )}

        {isCommunicationLedger && (
          <div className="col-md-12">
            <div className="com-links s465465465"><ul>{communicationTabs.map((tab) => (<li key={tab.path}><NavLink className={({ isActive }) => `active ${isActive ? 'activekkkkk' : ''}`.trim()} to={tab.path}>{tab.label}</NavLink></li>))}</ul></div>
            <div className="filterration recharge ladgers">
              <div className="wrapperdz-filtz ladgerss">
                <div className="wrapper-filter recharge 0001122"><label className="calendar-label padding">Search Type</label><input className="mini-input" value="Tracking ID" readOnly /><input className="mini-input" placeholder="Search by" /></div>
                <div className="mid-divcalender pendingg">
                  <label className="calendar-label padding">Select Date</label>
                  <ParcelXDateRangePicker
                    value={dateRange}
                    onApply={(range) => {
                      setDateRange(range)
                      setFilters((prev) => ({
                        ...prev,
                        dateFrom: range.start.toISOString(),
                        dateTo: range.end.toISOString(),
                      }))
                    }}
                    placeholder="Select Date Range"
                    wrapperClassName="date-wrapper"
                    inputClassName="custom-range-picker mini-input w-240"
                  />
                </div>
                <div className="channel report"><label className="calendar-label padding">Action</label><input className="mini-input" placeholder="Select" readOnly /></div>
                <div className="channel"><label className="calendar-label padding">Channels</label><input className="mini-input" placeholder="Select a channel" readOnly /></div>
                <div className="wrapperz-button"><button className="search">Search</button><button className="search">Reset</button></div>
              </div>
            </div>
            <div className="tickets-table pand">
              <div className="header-container"><div className="summary-actions wallet"><div className="top____heading"><h3>Ledger</h3><span className="summary-text">0 Records from 03/21/2026 to 04/19/2026</span></div><div className="buttons"><button className="export-btn">Export</button></div></div></div>
              <div className="table-responsive"><table className="communication-grid-table"><thead><tr><th>#</th><th>Order Details</th><th>Tracking Details</th><th>Event</th><th>Transaction Details</th><th>Action</th></tr></thead><tbody><tr><td colSpan={6} className="empty-cell">No data</td></tr></tbody></table></div>
            </div>
          </div>
        )}

        {isCommunicationChannelPricing && (
          <div className="col-md-12">
            <div className="com-links s465465465"><ul>{communicationTabs.map((tab) => (<li key={tab.path}><NavLink className={({ isActive }) => `active ${isActive ? 'activekkkkk' : ''}`.trim()} to={tab.path}>{tab.label}</NavLink></li>))}</ul></div>
            <div className="tickets_table billing ndrcommunication">
              <div className="table-responsive">
                <table className="communication-grid-table">
                  <thead><tr><th>#</th><th>Channel</th><th>Credits</th></tr></thead>
                  <tbody>{channelPricingRows.map((row) => (<tr key={row.id}><td>{row.id}</td><td>{row.channel}</td><td>{row.credits}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Box sx={{ p: '18px 18px 28px', fontFamily: 'Instrument Sans, sans-serif' }}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Box sx={{ background: '#f5f6f8', borderRadius: '14px', p: '5px 8px', minHeight: 55, display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          {topTabs.map((tab) => {
            const active = location.pathname === tab.path
            return (
              <Button
                key={tab.path}
                component={NavLink}
                to={tab.path}
                sx={{
                  minHeight: 41,
                  px: 2.25,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: active ? '#fff' : '#1f2937',
                  background: active ? '#111' : 'transparent',
                }}
              >
                {tab.label}
              </Button>
            )
          })}
        </Box>
      </Box>

      <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.5} alignItems={{ xl: 'flex-end' }} sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
          <Box>
            <Typography sx={{ color: '#000', fontSize: '0.78rem', fontWeight: 500, mb: 0.5 }}>Date Type</Typography>
            <TextField
              select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              sx={{ ...fieldSx, minWidth: 180 }}
              SelectProps={{ IconComponent: FiChevronDown }}
            >
              {dateTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ minWidth: 290 }}>
            <Typography sx={{ color: '#000', fontSize: '0.78rem', fontWeight: 500, mb: 0.5 }}>Select Date</Typography>
            <ParcelXDateRangePicker
              value={dateRange}
              onApply={(range) => {
                setDateRange(range)
                setFilters((prev) => ({
                  ...prev,
                  dateFrom: range.start.toISOString(),
                  dateTo: range.end.toISOString(),
                }))
              }}
              placeholder="Select Date Range"
              wrapperClassName="date-wrapper mui-date-wrapper"
              inputClassName="custom-range-picker mui-range-picker"
            />
          </Box>

          <Box>
            <Typography sx={{ color: '#000', fontSize: '0.78rem', fontWeight: 500, mb: 0.5 }}>Search Type</Typography>
            <TextField
              select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              sx={{ ...fieldSx, minWidth: 170 }}
              SelectProps={{ IconComponent: FiChevronDown }}
            >
              {searchTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ minWidth: 260 }}>
            <Typography sx={{ color: '#000', fontSize: '0.78rem', fontWeight: 500, mb: 0.5 }}>Search</Typography>
            <TextField
              multiline
              minRows={2}
              maxRows={2}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="xxxxxxxxxxxx xxxxxxxxxxxx"
              sx={{
                ...fieldSx,
                '& .MuiOutlinedInput-root': {
                  ...fieldSx['& .MuiOutlinedInput-root'],
                  minHeight: 62,
                  alignItems: 'flex-start',
                },
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ color: '#000', fontSize: '0.78rem', fontWeight: 500, mb: 0.5 }}>Amount</Typography>
            <Stack direction="row" spacing={0}>
              <TextField
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Min"
                sx={{ ...fieldSx, minWidth: 100, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], borderRadius: '8px 0 0 8px' } }}
              />
              <TextField
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Max"
                sx={{ ...fieldSx, minWidth: 100, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], borderRadius: '0 8px 8px 0' } }}
              />
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<FiSearch />}
            sx={{
              minHeight: 40,
              borderRadius: '6px',
              border: 'none',
              color: '#fff',
              background: brand.accent,
              textTransform: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              px: 1.75,
            }}
          >
            Search
          </Button>
          <Button
            startIcon={<FiRefreshCw />}
            onClick={() => {
              setFilters({})
              setSearchValue('')
              setMinAmount('')
              setMaxAmount('')
              setPage(1)
            }}
            sx={{
              minHeight: 40,
              borderRadius: '6px',
              border: '1px solid #ece9f1',
              color: '#111',
              background: '#fff',
              textTransform: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              px: 1.75,
            }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ background: '#fff', borderRadius: '12px', border: '1px solid #ece9f1', overflow: 'hidden' }}>
        <Box sx={{ p: '16px 18px 12px' }}>
          <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" spacing={1.5}>
            <Box>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 600, color: '#222', lineHeight: 1 }}>
                {pageHeading}
              </Typography>
              <Typography sx={{ color: '#6b7280', fontSize: '0.84rem', mt: 0.6 }}>
                Showing <strong>{transactions.length} Orders</strong>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                startIcon={<FiUpload />}
                sx={{
                  minHeight: 40,
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#111',
                  background: 'transparent',
                }}
              >
                Export Charges
              </Button>
              <Button
                startIcon={<FiUpload />}
                sx={{
                  minHeight: 40,
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#111',
                  background: 'transparent',
                }}
              >
                Export Ledger
              </Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={1.25} sx={{ mt: 1.4 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.82rem', color: '#111' }}>Item Per Page:</Typography>
              <TextField
                select
                value="50"
                sx={{ ...fieldSx, minWidth: 90 }}
                SelectProps={{ IconComponent: FiChevronDown }}
              >
                <MenuItem value="50">50</MenuItem>
              </TextField>
            </Stack>

            <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} size="small" />
          </Stack>
        </Box>

        <Divider />

        <TableContainer sx={{ background: '#f5f7fb' }}>
          <Table sx={{ minWidth: 1400, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ background: '#fff' }}>
                <TableCell sx={{ width: 56, fontWeight: 700 }} />
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Order Details</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Tracking Details</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Transaction Details</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Wallet Ledger</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Amount Details</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Billing Weight</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Zone</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Forward</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>RTO</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Cancel</TableCell>
                <TableCell sx={{ fontWeight: 700, color: brand.accent }}>Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index} sx={{ background: '#fff' }}>
                    {Array.from({ length: 12 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>...</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : transactions.length ? (
                transactions.map((txn, index) => (
                  <TableRow key={txn.id || index} sx={{ background: index % 2 === 0 ? '#fff4ed' : '#fff' }}>
                    <TableCell>
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{txn.meta?.order_number || '--'}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#667085' }}>{txn.reason || 'Transaction'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{txn.ref || '--'}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#667085' }}>{searchType}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.76rem', color: '#111' }}>{formatDateTime(txn.created_at)}</Typography>
                      <Chip
                        label={txn.type || 'debit'}
                        size="small"
                        sx={{
                          mt: 0.5,
                          height: 22,
                          background: txn.type === 'credit' ? '#e8f8ef' : '#fff0ea',
                          color: txn.type === 'credit' ? '#1f9d55' : brand.accent,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.2}>
                        <Typography sx={{ fontSize: '0.76rem' }}>OPN. {formatMoney(0)}</Typography>
                        <Typography sx={{ fontSize: '0.76rem' }}>CLS. {formatMoney(0)}</Typography>
                        <Typography sx={{ fontSize: '0.76rem', fontWeight: 700 }}>AMT. {formatMoney(txn.amount)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.76rem' }}>{formatMoney(txn.amount)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.76rem' }}>--</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.76rem' }}>--</Typography>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.76rem' }}>{formatMoney(0)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.76rem' }}>{formatMoney(0)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.76rem' }}>{formatMoney(0)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.76rem' }}>{formatMoney(0)}</Typography></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} sx={{ textAlign: 'center', py: 5, background: '#fff' }}>
                    No data available for the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: '14px 18px', background: '#fff' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={1.25}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '0.82rem', color: '#111' }}>Item Per Page:</Typography>
              <TextField select value="50" sx={{ ...fieldSx, minWidth: 90 }} SelectProps={{ IconComponent: FiChevronDown }}>
                <MenuItem value="50">50</MenuItem>
              </TextField>
            </Stack>
            <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} size="small" />
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
