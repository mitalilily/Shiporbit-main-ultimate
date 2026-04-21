import { useMemo, useState } from 'react'
import { FiChevronDown, FiFilter, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { HiOutlineDownload } from 'react-icons/hi'
import { TbCircle, TbCircleDot, TbListDetails, TbTruckDelivery } from 'react-icons/tb'
import { NavLink, useLocation } from 'react-router-dom'
import ParcelXDateRangePicker from '../../components/UI/inputs/ParcelXDateRangePicker'
import { toast } from '../../components/UI/Toast'

const topTabs = [
  { label: 'Processed Order', path: '/shipment' },
  { label: 'Failed Orders', path: '/shipment/failed' },
]

const processedStatuses = [
  'Not Picked',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'NDR',
  'Return',
  'Cancelled',
  'On Process',
  'Draft Orders',
  'All Orders',
]

const dateTypeOptions = ['Placed Date', 'Manifest Date', 'Updated Date']
const searchTypeOptions = [
  'Tracking ID',
  'Order ID',
  'AWB',
  'Invoice Number',
  'Customer Mobile',
]
const pageSizeOptions = ['100', '200', '500']

const emptyForwardFailedColumns = [
  'Order Details',
  'Invoice/Ref No.',
  'Product Details',
  'Amount Details',
  'Pickup Address',
  'Consignee Address',
  'User Contact',
  'Weight Details',
  'Others',
  'Failure Reason',
  'Re-Order',
]

const emptyReverseFailedColumns = [
  'Pickup Request',
  'Return Ref No.',
  'Product Details',
  'Pickup Address',
  'Customer Address',
  'Contact Details',
  'Weight Details',
  'Courier / Pickup',
  'Failure Reason',
  'Re-Create',
]

const emptyProcessedForwardColumns = [
  'Order Details',
  'Tracking Details',
  'Invoice/Ref No.',
  'Product Details',
  'Amount Details',
  'Pickup Address',
  'Consignee Address',
  'User Contact',
  'Status',
  'Action',
]

const emptyProcessedReverseColumns = [
  'Pickup Request',
  'Tracking Details',
  'Return Ref No.',
  'Product Details',
  'Pickup Address',
  'Customer Address',
  'Pickup Contact',
  'Status',
  'Action',
]

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

const createCsv = (headers: string[], rows: string[][]) =>
  [headers, ...rows]
    .map((line) => line.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

const triggerDownload = (content: string, fileName: string, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const samplePicklistRows = (shipmentFlow: 'forward' | 'reverse') =>
  shipmentFlow === 'forward'
    ? [['PKL-001', 'Demo SKU', 'Demo Product', '1', 'A-01', 'Forward']]
    : [['RPK-001', 'RET-SKU', 'Return Demo Product', '1', 'R-01', 'Reverse']]

export default function Orders() {
  const location = useLocation()
  const isFailed = isPath(location.pathname, '/shipment/failed')
  const [showFilter, setShowFilter] = useState(true)
  const [shipmentFlow, setShipmentFlow] = useState<'forward' | 'reverse'>('forward')
  const [activeShipmentStatus, setActiveShipmentStatus] = useState('Not Picked')
  const [dateType, setDateType] = useState(dateTypeOptions[0])
  const [searchType, setSearchType] = useState(searchTypeOptions[0])
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])

  const screenKey = `${isFailed ? 'failed' : 'processed'}-${shipmentFlow}` as const

  const screenConfig = useMemo(() => {
    switch (screenKey) {
      case 'failed-forward':
        return {
          title: 'Orders',
          summary: 'Showing: 0 of 0 orders',
          columns: emptyForwardFailedColumns,
          noData: 'No failed forward orders found for the selected filters.',
          buttons: [
            { key: 'process', label: 'Process Failed Orders' },
            { key: 'bulk-format', label: 'Export-bulk order format' },
            { key: 'export', label: 'Export' },
          ],
        }
      case 'failed-reverse':
        return {
          title: 'Reverse Failed Orders',
          summary: 'Showing: 0 of 0 reverse pickups',
          columns: emptyReverseFailedColumns,
          noData: 'No failed reverse pickups found for the selected filters.',
          buttons: [
            { key: 'process', label: 'Process Failed Reverse Orders' },
            { key: 'bulk-format', label: 'Export reverse-bulk format' },
            { key: 'export', label: 'Export' },
          ],
        }
      case 'processed-reverse':
        return {
          title: 'Reverse Orders',
          summary: 'Showing: 0 - 0 of 0 reverse orders',
          columns: emptyProcessedReverseColumns,
          noData: 'No reverse orders found. Try adjusting filters.',
          buttons: [
            { key: 'export', label: 'Export' },
            { key: 'picklist', label: 'Product Picklist' },
          ],
        }
      case 'processed-forward':
      default:
        return {
          title: activeShipmentStatus,
          summary: 'Showing: 0 - 0 of 0 orders',
          columns: emptyProcessedForwardColumns,
          noData: 'No orders found. Try adjusting filters.',
          buttons: [
            { key: 'export', label: 'Export' },
            { key: 'picklist', label: 'Product Picklist' },
          ],
        }
    }
  }, [activeShipmentStatus, screenKey])

  const handleSearch = () => {
    const query = searchText
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)
      .join(', ')

    toast.open({
      message: query
        ? `Applied ${searchType} search for ${query}.`
        : `Applied ${searchType} filter.`,
      severity: 'info',
    })
  }

  const handleReset = () => {
    setDateType(dateTypeOptions[0])
    setSearchType(searchTypeOptions[0])
    setSearchText('')
    setActiveShipmentStatus('Not Picked')
    toast.open({ message: 'Shipment filters reset.', severity: 'success' })
  }

  const handleManifest = () => {
    const manifestHeaders =
      shipmentFlow === 'forward'
        ? ['order_id', 'awb', 'customer_name', 'pincode', 'mode']
        : ['return_id', 'pickup_request_id', 'customer_name', 'pickup_pincode', 'mode']

    triggerDownload(
      createCsv(manifestHeaders, []),
      `${shipmentFlow}-${isFailed ? 'failed-' : ''}shipping-manifest-template.csv`,
    )
    toast.open({ message: 'Shipping manifest template downloaded.', severity: 'success' })
  }

  const handleToolbarAction = (action: string) => {
    if (action === 'process') {
      const message = shipmentFlow === 'forward'
        ? 'Failed order processing template prepared.'
        : 'Failed reverse order processing template prepared.'
      triggerDownload(
        createCsv(
          ['reference_id', 'action', 'notes'],
          [],
        ),
        `${shipmentFlow}-failed-processing-template.csv`,
      )
      toast.open({ message, severity: 'success' })
      return
    }

    if (action === 'bulk-format') {
      const headers =
        shipmentFlow === 'forward'
          ? ['order_id', 'customer_name', 'phone', 'address', 'sku', 'quantity', 'payment_mode']
          : ['return_id', 'customer_name', 'phone', 'pickup_address', 'item_name', 'quantity']
      triggerDownload(
        createCsv(headers, []),
        `${shipmentFlow}-${isFailed ? 'failed-' : ''}bulk-order-format.csv`,
      )
      toast.open({ message: 'Bulk order format downloaded.', severity: 'success' })
      return
    }

    if (action === 'picklist') {
      triggerDownload(
        createCsv(['Picklist ID', 'SKU', 'Product Name', 'Qty', 'Bin', 'Flow'], samplePicklistRows(shipmentFlow)),
        `${shipmentFlow}-${isFailed ? 'failed-' : ''}product-picklist.csv`,
      )
      toast.open({ message: 'Product picklist downloaded.', severity: 'success' })
      return
    }

    triggerDownload(
      createCsv(screenConfig.columns, []),
      `${shipmentFlow}-${isFailed ? 'failed-' : ''}orders-export.csv`,
    )
    toast.open({ message: 'Export downloaded successfully.', severity: 'success' })
  }

  return (
    <div className="warpperzzz shipments-page">
      <div className="topnav-btn channel shipments">
        <div className="wrapperdz-filtz">
          <ul>
            {topTabs.map((tab) => {
              const active = isPath(location.pathname, tab.path)
              return (
                <li key={tab.path}>
                  <NavLink
                    to={tab.path}
                    className={`topnav-btn ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {tab.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          <ul className="thetwotabsselecs shipment">
            <li>
              <span
                role="button"
                tabIndex={0}
                className={`theactiveshows ${shipmentFlow === 'forward' ? 'active-link' : ''}`}
                onClick={() => setShipmentFlow('forward')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setShipmentFlow('forward')
                  }
                }}
              >
                {shipmentFlow === 'forward' ? (
                  <TbCircleDot size={18} color="#ff6600" />
                ) : (
                  <TbCircle size={18} color="#ff6600" />
                )}
                <span className={`theordertypes ${shipmentFlow === 'forward' ? 'active-link' : ''}`}>
                  Forward
                </span>
              </span>
            </li>
            <li className="divider" />
            <li>
              <span
                role="button"
                tabIndex={0}
                className={`theactiveshows ${shipmentFlow === 'reverse' ? 'active-link' : ''}`}
                onClick={() => setShipmentFlow('reverse')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setShipmentFlow('reverse')
                  }
                }}
              >
                {shipmentFlow === 'reverse' ? (
                  <TbCircleDot size={18} color="#ff6600" />
                ) : (
                  <TbCircle size={18} color="#ff6600" />
                )}
                <span className={`theordertypes ${shipmentFlow === 'reverse' ? 'active-link' : ''}`}>
                  Reverse
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div className="addmorech shipmentsss">
          <button
            className="btn btn-secondary me-2"
            type="button"
            onClick={() => setShowFilter((value) => !value)}
          >
            <FiFilter size={16} />
            {showFilter ? 'Hide Filter' : 'Show Filter'}
          </button>
          <div className="left-navchan shipmentss">
            <button type="button" onClick={handleManifest}>
              <TbTruckDelivery size={16} />
              Shipping Manifest
            </button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="filterration filzd">
          <div className="wrapperdz-filtz process">
            <div className="thefiltercate dash">
              <label className="s_select_date">Select Date</label>
              <div id="DateRangePickerContainer" className="daterangepickercontainer">
                <div id="DateRangePickerChildren">
                  <ParcelXDateRangePicker
                    placeholder="Select Date Range"
                    wrapperClassName="date-input-holder"
                  />
                </div>
              </div>
            </div>

            <div className="channel report">
              <label className="calendar-label padding">Date Type</label>
              <div className="shipment-native-select">
                <select value={dateType} onChange={(event) => setDateType(event.target.value)}>
                  {dateTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FiChevronDown size={16} />
              </div>
            </div>

            <div className="wrapper-filter shipment ordervalues">
              <label className="calendar-label padding">Search Type</label>
              <div className="right-filtrat filtz">
                <div className="filter-container">
                  <div className="shipment-search-shell">
                    <div className="shipment-native-select compact">
                      <select value={searchType} onChange={(event) => setSearchType(event.target.value)}>
                        {searchTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown size={16} />
                    </div>
                    <textarea
                      className="border-0 form-control"
                      placeholder="xxxxxxxxxxxx xxxxxxxxxxxx"
                      rows={1}
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="search" type="button" onClick={handleSearch}>
              <FiSearch size={14} />
              Search
            </button>
            <button className="search" type="button" onClick={handleReset}>
              <FiRefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>
      )}

      {!isFailed && (
        <div className="com-links s465465465 shipment-status-links">
          <ul>
            {processedStatuses.map((status) => (
              <li key={status}>
                <a
                  className={`active ${status === activeShipmentStatus ? 'activekkkkk' : ''}`}
                  href="/shipment"
                  onClick={(event) => {
                    event.preventDefault()
                    setActiveShipmentStatus(status)
                  }}
                >
                  {status}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`tickets-table pand processorder-table ${isFailed ? 'failledzzs' : ''}`}>
        <div className="row">
          <div className="col-md-12">
            <div className="header-container">
              <div className={`summary-actions ${isFailed ? 'failed-summary' : ''}`}>
                <div className="top____heading shipment">
                  <div className="showing-record-heading">
                    <h3>{screenConfig.title}</h3>
                    <span className="summary-text">
                      {isFailed ? (
                        <>
                          Showing: <strong>{screenConfig.summary.replace('Showing: ', '')}</strong>
                        </>
                      ) : (
                        <>
                          Showing: <strong>{screenConfig.summary.replace('Showing: ', '')}</strong>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="warpped-peg shipment-page-size">
                    <div className="shipment-native-select compact page-size">
                      <select value={pageSize} onChange={(event) => setPageSize(event.target.value)}>
                        {pageSizeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="buttons button_000114414 justify-content-end">
                  {screenConfig.buttons.map((button) => (
                    <button
                      key={button.key}
                      className={`export-btn ${button.key === 'process' ? 'primary' : ''}`}
                      type="button"
                      onClick={() => handleToolbarAction(button.key)}
                    >
                      {button.key === 'picklist' ? (
                        <TbListDetails size={17} />
                      ) : (
                        <HiOutlineDownload size={17} />
                      )}
                      {button.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`tickets_table processorder ${isFailed ? 'failled' : ''}`}>
              <div className={`table-body processorder ${isFailed ? 'failled' : ''}`}>
                <div className="table__x process">
                  <div className={`ant-table-wrapper table-main ${isFailed ? 'failed-table' : ''}`}>
                    <div className="ant-table ant-table-middle ant-table-empty ant-table-scroll-horizontal ant-table-has-fix-left ant-table-has-fix-right">
                      <div className="ant-table-container">
                        <div className="ant-table-content">
                          <table className={`shipment-grid-table ${isFailed ? 'wide' : ''}`}>
                            <colgroup>
                              <col style={{ width: 60 }} />
                              {screenConfig.columns.map((column) => (
                                <col
                                  key={column}
                                  style={{
                                    width: isFailed
                                      ? column === 'Failure Reason' || column === 'Others'
                                        ? 240
                                        : column === 'Re-Order' || column === 'Re-Create'
                                          ? 100
                                          : 160
                                      : 160,
                                  }}
                                />
                              ))}
                            </colgroup>
                            <thead className="ant-table-thead">
                              <tr>
                                <th className="ant-table-cell ant-table-cell-fix-left ant-table-cell-fix-left-last">
                                  <input type="checkbox" className="shipment-checkbox" />
                                </th>
                                {screenConfig.columns.map((column) => (
                                  <th
                                    key={column}
                                    className={`ant-table-cell ${column === 'Failure Reason' || column === 'Re-Order' || column === 'Re-Create' ? 'ant-table-cell-fix-right' : ''}`}
                                  >
                                    {column}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                              <tr className="ant-table-placeholder">
                                <td className="ant-table-cell" colSpan={screenConfig.columns.length + 1}>
                                  <div className="shipment-empty-state">
                                    <div className="shipment-empty-title">No data</div>
                                    <div className="shipment-empty-copy">{screenConfig.noData}</div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pagination-container">
              <div className="warpped-peg shipment-pagination-shell">
                <span>Item Per Page:</span>
                <div className="shipment-native-select compact page-size">
                  <select value={pageSize} onChange={(event) => setPageSize(event.target.value)}>
                    {pageSizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown size={16} />
                </div>
                <div className="shipment-pagination-right">
                  <ul className="ant-pagination custom-pagination">
                    <li className="ant-pagination-prev ant-pagination-disabled" aria-disabled="true">
                      <button className="ant-pagination-item-link" type="button" disabled>
                        Previous
                      </button>
                    </li>
                    <li className="ant-pagination-item ant-pagination-item-1 ant-pagination-item-disabled">
                      <a rel="nofollow">1</a>
                    </li>
                    <li className="ant-pagination-next ant-pagination-disabled" aria-disabled="true">
                      <button className="ant-pagination-item-link" type="button" disabled>
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
