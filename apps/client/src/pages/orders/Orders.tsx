import { useMemo, useState } from 'react'
import { FiCalendar, FiFilter, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { HiOutlineDownload } from 'react-icons/hi'
import { TbCircle, TbCircleDot, TbListDetails, TbTruckDelivery } from 'react-icons/tb'
import { NavLink, useLocation } from 'react-router-dom'

const topTabs = [
  { label: 'Processed Order', path: '/shipment' },
  { label: 'Failed Orders', path: '/shipment/failed' },
]

const shipmentStatuses = [
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

const isPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

export default function Orders() {
  const location = useLocation()
  const isFailed = isPath(location.pathname, '/shipment/failed')
  const [showFilter, setShowFilter] = useState(true)
  const [shipmentFlow, setShipmentFlow] = useState<'forward' | 'reverse'>('forward')
  const [activeShipmentStatus, setActiveShipmentStatus] = useState('Not Picked')

  const sectionTitle = isFailed ? 'Failed Orders' : activeShipmentStatus
  const summaryLabel = useMemo(
    () => (isFailed ? 'Showing: 0 - 0 of 0 failed orders' : 'Showing: 0 - 0 of 0 orders'),
    [isFailed],
  )

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

          {!isFailed && (
            <ul className="thetwotabsselecs shipment">
              <li>
                <span
                  role="button"
                  tabIndex={0}
                  className={`theactiveshows ${shipmentFlow === 'forward' ? 'active-link' : ''}`}
                  onClick={() => setShipmentFlow('forward')}
                  onKeyDown={(e) => e.key === 'Enter' && setShipmentFlow('forward')}
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
                  onKeyDown={(e) => e.key === 'Enter' && setShipmentFlow('reverse')}
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
          )}
        </div>

        <div className="addmorech shipmentsss">
          <button
            className="btn btn-secondary me-2"
            type="button"
            onClick={() => setShowFilter((v) => !v)}
          >
            <FiFilter size={16} />
            {showFilter ? 'Hide Filter' : 'Show Filter'}
          </button>
          <div className="left-navchan shipmentss">
            <button type="button">
              <TbTruckDelivery size={16} />
              Shipping Manifest
            </button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="filterration filzd">
          <div className="wrapperdz-filtz process">
            <div className="channel report">
              <label className="calendar-label padding">Date Type</label>
              <div className="ant-select ant-select-outlined custom-select reportz">
                <div className="ant-select-selector">
                  <span className="ant-select-selection-wrap">
                    <span className="ant-select-selection-item" title="Placed Date">
                      Placed Date
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="thefiltercate dash">
              <label className="s_select_date">Select Date</label>
              <div id="DateRangePickerContainer" className="daterangepickercontainer">
                <div id="DateRangePickerChildren">
                  <div className="date-input-holder">
                    <input
                      placeholder="Select Date Range"
                      className="ant-input ant-input-outlined custom-range-picker"
                      type="text"
                      value="12-Apr-2026 12:00 am - 19-Apr-2026 11:59 pm"
                      readOnly
                    />
                    <span className="calender_0099">
                      <FiCalendar size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="wrapper-filter shipment ordervalues">
              <label className="calendar-label padding">Search Type</label>
              <div className="right-filtrat filtz">
                <div className="filter-container">
                  <div className="ant-select ant-select-outlined reportz select-search-input m-0 p-0">
                    <div className="ant-select-selector">
                      <span className="ant-select-selection-wrap">
                        <span className="ant-select-selection-item" title="Tracking ID">
                          Tracking ID
                        </span>
                      </span>
                    </div>
                    <textarea
                      className="border-0 form-control"
                      placeholder="xxxxxxxxxxxx xxxxxxxxxxxx"
                      rows={1}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="search" type="button">
              <FiSearch size={14} />
              Search
            </button>
            <button className="search" type="button">
              <FiRefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="com-links s465465465 shipment-status-links">
        <ul>
          {shipmentStatuses.map((status) => (
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

      <div className="tickets-table pand processorder-table">
        <div className="row">
          <div className="col-md-12">
            <div className="header-container">
              <div className="summary-actions">
                <div className="top____heading shipment d-block">
                  <div className="showing-record-heading">
                    <h3>{sectionTitle}</h3>
                    <span className="summary-text">
                      {summaryLabel.includes('failed') ? (
                        <strong>{summaryLabel.replace('Showing: ', '')}</strong>
                      ) : (
                        <>
                          Showing: <strong>0 - 0 of 0 orders</strong>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="ant-select ant-select-outlined shipment-select ant-select-single ant-select-show-arrow">
                      <div className="ant-select-selector">
                        <span className="ant-select-selection-wrap">
                          <span className="ant-select-selection-item" title="200">
                            200
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="buttons button_000114414 justify-content-end mb-3">
                  <div className="dropdown">
                    <button className="process-btn dropdown-toggle" type="button">
                      <HiOutlineDownload size={16} />
                      Export
                    </button>
                  </div>
                  <button className="process-btn" type="button">
                    <TbListDetails size={16} />
                    Product Picklist
                  </button>
                </div>
              </div>
            </div>

            <div className="tickets_table processorder">
              <div className="table-body processorder">
                <div className="table__x process">
                  <div className="ant-table-wrapper table-main">
                    <div className="ant-table ant-table-middle ant-table-empty ant-table-scroll-horizontal">
                      <div className="ant-table-container">
                        <div className="ant-table-content">
                          <table style={{ width: '100%', minWidth: 1100, tableLayout: 'fixed' }}>
                            <thead className="ant-table-thead">
                              <tr>
                                <th className="ant-table-cell">
                                  <input type="checkbox" className="shipment-checkbox" />
                                </th>
                                <th className="ant-table-cell">Order Details</th>
                                <th className="ant-table-cell">Tracking Details</th>
                                <th className="ant-table-cell">Invoice/Ref No.:</th>
                                <th className="ant-table-cell">Product Details</th>
                                <th className="ant-table-cell">Amount Details</th>
                                <th className="ant-table-cell">Pickup Address</th>
                                <th className="ant-table-cell">Consignee Address</th>
                                <th className="ant-table-cell">User Contact</th>
                                <th className="ant-table-cell">Status</th>
                                <th className="ant-table-cell">Action</th>
                              </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                              <tr className="ant-table-placeholder">
                                <td className="ant-table-cell" colSpan={11}>
                                  No orders found. Try adjusting filters.
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
              <div className="warpped-peg">
                <div style={{ textAlign: 'right', marginTop: 16 }}>
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
