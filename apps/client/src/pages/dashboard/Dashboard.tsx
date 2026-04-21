import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useMerchantDashboardStats } from '../../hooks/useDashboard'
import ParcelXDateRangePicker from '../../components/UI/inputs/ParcelXDateRangePicker'

type DashboardMetricCard = {
  title: string
  value: number
  tooltip: string
  icon: React.ReactNode
  className?: string
}

const numberFrom = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const countFromStatus = (
  items: Array<{ status?: string; count?: number }> | undefined,
  matches: string[],
) =>
  (items || []).reduce((total, item) => {
    const status = String(item.status || '').toLowerCase()
    return matches.some((match) => status.includes(match)) ? total + numberFrom(item.count) : total
  }, 0)

const sumFromStatuses = (
  items: Array<{ status?: string; count?: number }> | undefined,
  predicate: (status: string) => boolean,
) =>
  (items || []).reduce((total, item) => {
    const status = String(item.status || '').toLowerCase().trim()
    return predicate(status) ? total + numberFrom(item.count) : total
  }, 0)

const percentageOf = (value: number, total: number) => {
  if (total <= 0) {
    return 0
  }

  return Math.round((value / total) * 100)
}

const shortStateLabel = (value: string) => {
  const cleaned = value.trim()
  if (cleaned.length <= 10) {
    return cleaned
  }

  return `${cleaned.slice(0, 10).trim()}...`
}

const shortDateLabel = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return format(date, 'dd MMM')
}

const metricIconStyle = { width: '1em', height: '1em' as const }

const infoGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 24 24">
    <path fill="currentColor" d="M11.5 16.5h1V11h-1zm.934-7.1q.182-.177.182-.439t-.178-.438T12 8.346t-.438.177t-.177.439t.181.438t.434.177t.434-.177m-.43 11.6q-1.868 0-3.511-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
  </svg>
)

const filterGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24">
    <path fill="currentColor" d="M15 19.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0L9.29 16.7a.99.99 0 0 1-.29-.83v-5.12L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L15 10.75zM7.04 5L11 10.06v5.52l2 2v-7.53L16.96 5z" />
  </svg>
)

const exportGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24">
    <path fill="currentColor" d="M11 16h2V7h3l-4-5l-4 5h3z" />
    <path fill="currentColor" d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2" />
  </svg>
)

const totalProcessedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" style={metricIconStyle}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6m8-3V4M8 8H3" />
  </svg>
)

const pickedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" style={metricIconStyle}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
      <path d="M21 7v5M3 7v10.161c0 1.383 1.946 2.205 5.837 3.848C10.4 21.67 11.182 22 12 22V11.355M15 19s.875 0 1.75 2c0 0 2.78-5 5.25-6" />
      <path d="M8.326 9.691L5.405 8.278C3.802 7.502 3 7.114 3 6.5s.802-1.002 2.405-1.778l2.92-1.413C10.13 2.436 11.03 2 12 2s1.871.436 3.674 1.309l2.921 1.413C20.198 5.498 21 5.886 21 6.5s-.802 1.002-2.405 1.778l-2.92 1.413C13.87 10.564 12.97 11 12 11s-1.871-.436-3.674-1.309M6 12l2 1m9-9L7 9" />
    </g>
  </svg>
)

const inTransitIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" style={metricIconStyle}>
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 17.972c-1.097-.054-1.78-.217-2.268-.704s-.65-1.171-.704-2.268M9 18h6m4-.028c1.097-.054 1.78-.217 2.268-.704C22 16.535 22 15.357 22 13v-2h-4.7c-.745 0-1.117 0-1.418-.098a2 2 0 0 1-1.284-1.284C14.5 9.317 14.5 8.945 14.5 8.2c0-1.117 0-1.675-.147-2.127a3 3 0 0 0-1.926-1.926C11.975 4 11.417 4 10.3 4H2m0 4h6m-6 3h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6h1.821c1.456 0 2.183 0 2.775.354c.593.353.938.994 1.628 2.276L22 11" />
    </g>
  </svg>
)

const outForDeliveryIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" style={metricIconStyle}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
      <path d="M2.5 7.5v6c0 3.771 0 5.657 1.172 6.828S6.729 21.5 10.5 21.5H14M21.5 11V7.5M3.87 5.315L2.5 7.5h19l-1.252-2.087c-.854-1.423-1.28-2.134-1.969-2.524c-.687-.389-1.517-.389-3.176-.389h-6.15c-1.623 0-2.435 0-3.113.375c-.678.376-1.109 1.064-1.97 2.44M12 7.5v-5m-2 8h4m4 2.5c-1.933 0-3.5 1.538-3.5 3.434c0 1.085.438 1.928 1.313 2.681c.616.531 1.738 1.67 2.187 2.385c.471-.7 1.57-1.854 2.188-2.385c.875-.753 1.312-1.596 1.312-2.68C21.5 14.537 19.933 13 18 13" />
      <path d="M18.135 16.5h-.125m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0" />
    </g>
  </svg>
)

const deliveredIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 48 48" style={metricIconStyle}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
      <path d="m20 33l6 2s15-3 17-3s2 2 0 4s-9 8-15 8s-10-3-14-3H4" />
      <path d="M4 29c2-2 6-5 10-5s13.5 4 15 6s-3 5-3 5M16 18v-8a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v16" />
      <path d="M25 8h10v9H25z" />
    </g>
  </svg>
)

const rtoIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" style={metricIconStyle}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
      <path d="M20 4v5h-5" />
    </g>
  </svg>
)

const cancelledIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" style={metricIconStyle}>
    <path fill="currentColor" d="M20.48 3.512a11.97 11.97 0 0 0-8.486-3.514C5.366-.002-.007 5.371-.007 11.999c0 3.314 1.344 6.315 3.516 8.487A11.97 11.97 0 0 0 11.995 24c6.628 0 12.001-5.373 12.001-12.001c0-3.314-1.344-6.315-3.516-8.487m-1.542 15.427a9.8 9.8 0 0 1-6.943 2.876c-5.423 0-9.819-4.396-9.819-9.819a9.8 9.8 0 0 1 2.876-6.943a9.8 9.8 0 0 1 6.942-2.876c5.422 0 9.818 4.396 9.818 9.818a9.8 9.8 0 0 1-2.876 6.942z" />
    <path fill="currentColor" d="m13.537 12l3.855-3.855a1.091 1.091 0 0 0-1.542-1.541l.001-.001l-3.855 3.855l-3.855-3.855A1.091 1.091 0 0 0 6.6 8.145l-.001-.001l3.855 3.855l-3.855 3.855a1.091 1.091 0 1 0 1.541 1.542l.001-.001l3.855-3.855l3.855 3.855a1.091 1.091 0 1 0 1.542-1.541l-.001-.001z" />
  </svg>
)

const failedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" style={metricIconStyle}>
    <path fill="currentColor" d="M12 15q.425 0 .713-.288T13 14t-.288-.712T12 13t-.712.288T11 14t.288.713T12 15m.713-4.288Q13 10.425 13 10V6q0-.425-.288-.712T12 5t-.712.288T11 6v4q0 .425.288.713T12 11t.713-.288M6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-.85-2H20V4H4v13.125zM4 16V4z" />
  </svg>
)

const ndrCountIcon = totalProcessedIcon

const ndrInitiatedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19.5 17.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 17.5h-5m10 0h.763c.22 0 .33 0 .422-.012a1.5 1.5 0 0 0 1.303-1.302c.012-.093.012-.203.012-.423V13a6.5 6.5 0 0 0-6.5-6.5m-.5 9V7c0-1.414 0-2.121-.44-2.56C14.122 4 13.415 4 12 4H5c-1.414 0-2.121 0-2.56.44C2 4.878 2 5.585 2 7v8c0 .935 0 1.402.201 1.75a1.5 1.5 0 0 0 .549.549c.348.201.815.201 1.75.201" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.327 12l1.486-1.174C11.604 10.2 12 9.888 12 9.5M9.327 7l1.486 1.174C11.604 8.8 12 9.112 12 9.5m0 0H5" />
    </g>
  </svg>
)

const NOT_PICKED_ICON =
  'data:image/png;base64,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'

const InfoHover = ({ text, className = '' }: { text: React.ReactNode; className?: string }) => (
  <div className={`hover-container ${className}`.trim()}>
    <span className="theinfoicon">{infoGlyph}</span>
    <span className="hover-info">{text}</span>
  </div>
)

const DashboardStatCard = ({ item }: { item: DashboardMetricCard }) => (
  <div className={`card hover-container w-100 h-100 ${item.className || ''}`.trim()}>
    <div className="icon__566898">
      <div className="card-icon">{item.icon}</div>
    </div>
    <h3 className="card-title">{item.title}</h3>
    <h2 className="card-count">{item.value}</h2>
    <span className="hover-info">{item.tooltip}</span>
  </div>
)

const LegendStat = ({
  label,
  value,
  percentage,
  color,
  accent,
  shipmn = false,
}: {
  label: string
  value: number
  percentage: number
  color: string
  accent: string
  shipmn?: boolean
}) => (
  <div className="labelsitemss">
    <div className="thelabelinneritems">
      <div className={`theupperinnedetial${shipmn ? ' shipmn' : ''}`}>
        <div className="thelabescolors" style={{ backgroundColor: color }} />
        <p>{label}</p>
      </div>
      <div className="thelowerinnerdetails">
        <p>
          <span className="theperentdatas">
            <span style={{ color: 'rgb(0, 0, 0)' }}>{value}</span>
            <span className="legend-divider" />
            <span style={{ color: accent, fontWeight: 500 }}>{percentage}%</span>
          </span>
        </p>
      </div>
    </div>
  </div>
)

const EmptyCanvas = ({ height, width, className = '' }: { height: number; width: number; className?: string }) => (
  <canvas role="img" height={height} width={width} className={className} />
)

const ShipmentStatusDonut = ({
  delivered,
  live,
  rto,
}: {
  delivered: number
  live: number
  rto: number
}) => {
  const total = delivered + live + rto
  const deliveredAngle = percentageOf(delivered, total) * 3.6
  const liveAngle = percentageOf(live, total) * 3.6
  const chartStyle = {
    '--shipment-status-chart': `conic-gradient(
      rgba(19, 175, 40, 0.6) 0deg ${deliveredAngle}deg,
      rgba(245, 206, 106, 0.698) ${deliveredAngle}deg ${deliveredAngle + liveAngle}deg,
      rgba(175, 40, 19, 0.75) ${deliveredAngle + liveAngle}deg 360deg
    )`,
  } as React.CSSProperties

  return (
    <div
      className="shipment-status-donut"
      role="img"
      aria-label={`Shipment status: ${delivered} delivered, ${live} live shipments, ${rto} RTO`}
      style={chartStyle}
    >
      <div className="shipment-status-donut-core" />
    </div>
  )
}

const ShipmentTypeDonut = ({
  cod,
  prepaid,
  reverse,
}: {
  cod: number
  prepaid: number
  reverse: number
}) => {
  const total = cod + prepaid + reverse
  const codAngle = percentageOf(cod, total) * 3.6
  const prepaidAngle = percentageOf(prepaid, total) * 3.6
  const chartStyle = {
    '--shipment-type-chart': `conic-gradient(
      rgba(29, 76, 194, 0.8) 0deg ${codAngle}deg,
      rgb(15, 39, 98) ${codAngle}deg ${codAngle + prepaidAngle}deg,
      rgb(98, 143, 255) ${codAngle + prepaidAngle}deg 360deg
    )`,
  } as React.CSSProperties

  return (
    <div
      className="shipment-type-donut"
      role="img"
      aria-label={`Shipment type: ${cod} COD, ${prepaid} prepaid, ${reverse} reverse`}
      style={chartStyle}
    >
      <div className="shipment-type-donut-core" />
    </div>
  )
}

const OrderDistributionChart = ({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>
}) => {
  const svgWidth = 960
  const svgHeight = 500
  const paddingTop = 24
  const paddingRight = 18
  const paddingBottom = 76
  const paddingLeft = 58
  const chartWidth = svgWidth - paddingLeft - paddingRight
  const chartHeight = svgHeight - paddingTop - paddingBottom
  const maxValue = Math.max(...data.map((item) => item.value), 1)
  const barGap = 16
  const barWidth = Math.max(28, Math.floor((chartWidth - barGap * Math.max(0, data.length - 1)) / Math.max(1, data.length)))
  const innerHeight = chartHeight - 16
  const yTicks = 4

  return (
    <svg
      className="order-distribution-svg"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      role="img"
      aria-label="Order distribution by top states"
    >
      <defs>
        <linearGradient id="orderDistributionBackdrop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(232,239,255,0.86)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.92)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={svgWidth} height={svgHeight} rx="18" fill="url(#orderDistributionBackdrop)" />

      {Array.from({ length: yTicks + 1 }).map((_, index) => {
        const y = paddingTop + (innerHeight / yTicks) * index

        return (
          <g key={y}>
            <line
              x1={paddingLeft}
              y1={y}
              x2={svgWidth - paddingRight}
              y2={y}
              stroke="#d4d8df"
              strokeDasharray="4 6"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 12}
              y={y + 4}
              textAnchor="end"
              fontSize="11"
              fill="#6b7280"
              fontFamily="Instrument Sans, sans-serif"
            >
              {Math.round(maxValue - (maxValue / yTicks) * index)}
            </text>
          </g>
        )
      })}

      <line x1={paddingLeft} y1={paddingTop + innerHeight} x2={svgWidth - paddingRight} y2={paddingTop + innerHeight} stroke="#c9d3e6" strokeWidth="1.25" />
      <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + innerHeight} stroke="#c9d3e6" strokeWidth="1.25" />

      {data.map((item, index) => {
        const barHeight = Math.max(18, (item.value / maxValue) * (innerHeight - 22))
        const x = paddingLeft + index * (barWidth + barGap)
        const y = paddingTop + innerHeight - barHeight

        return (
          <g key={item.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="10"
              fill={item.color}
              opacity="0.92"
            />
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.min(26, barHeight)}
              rx="10"
              fill="rgba(255,255,255,0.18)"
            />
            <text
              x={x + barWidth / 2}
              y={y - 10}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#1f2937"
              fontFamily="Instrument Sans, sans-serif"
            >
              {item.value}
            </text>
            <text
              x={x + barWidth / 2}
              y={svgHeight - 26}
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill="#4b5563"
              fontFamily="Instrument Sans, sans-serif"
            >
              {shortStateLabel(item.label)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const NdrReportChart = ({
  data,
}: {
  data: Array<{ label: string; delivered: number; rto: number }>
}) => {
  const svgWidth = 820
  const svgHeight = 188
  const paddingLeft = 24
  const paddingRight = 18
  const paddingTop = 18
  const paddingBottom = 36
  const chartWidth = svgWidth - paddingLeft - paddingRight
  const chartHeight = svgHeight - paddingTop - paddingBottom
  const maxValue = Math.max(...data.flatMap((item) => [item.delivered, item.rto]), 1)
  const slotWidth = chartWidth / Math.max(data.length, 1)
  const barWidth = Math.min(22, Math.max(12, slotWidth / 4))

  return (
    <svg className="ndr-report-chart" viewBox={`0 0 ${svgWidth} ${svgHeight}`} role="img" aria-label="NDR report delivered versus RTO chart">
      {Array.from({ length: 3 }).map((_, index) => {
        const y = paddingTop + (chartHeight / 2) * index
        if (index === 2) {
          return null
        }

        return (
          <line
            key={y}
            x1={paddingLeft}
            y1={y}
            x2={svgWidth - paddingRight}
            y2={y}
            stroke="#d6dde6"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        )
      })}

      <line
        x1={paddingLeft}
        y1={paddingTop + chartHeight}
        x2={svgWidth - paddingRight}
        y2={paddingTop + chartHeight}
        stroke="#d6dde6"
        strokeWidth="1"
      />

      {data.map((item, index) => {
        const groupX = paddingLeft + slotWidth * index + (slotWidth - barWidth * 2 - 8) / 2
        const deliveredHeight = Math.max(8, (item.delivered / maxValue) * (chartHeight - 18))
        const rtoHeight = Math.max(8, (item.rto / maxValue) * (chartHeight - 18))
        const deliveredY = paddingTop + chartHeight - deliveredHeight
        const rtoY = paddingTop + chartHeight - rtoHeight

        return (
          <g key={item.label}>
            <rect x={groupX} y={deliveredY} width={barWidth} height={deliveredHeight} rx="6" fill="#6fc276" />
            <rect x={groupX + barWidth + 8} y={rtoY} width={barWidth} height={rtoHeight} rx="6" fill="#c5624f" />
            <text
              x={paddingLeft + slotWidth * index + slotWidth / 2}
              y={svgHeight - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
              fontFamily="Instrument Sans, sans-serif"
            >
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const SelectStub = ({ label, width = 150 }: { label: string; width?: number }) => (
  <div className="ant-select ant-select-outlined css-1261szd ant-select-single ant-select-show-arrow" style={{ width }}>
    <div className="ant-select-selector">
      <span className="ant-select-selection-wrap">
        <span className="ant-select-selection-search">
          <input
            type="search"
            autoComplete="off"
            className="ant-select-selection-search-input"
            role="combobox"
            aria-expanded="false"
            aria-haspopup="listbox"
            readOnly
            value=""
          />
        </span>
        <span className="ant-select-selection-item" title={label}>
          {label}
        </span>
      </span>
    </div>
    <span className="ant-select-arrow" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" />
      </svg>
    </span>
  </div>
)

const dashboardTabs = [
  { label: 'Overview', path: '/dashboard' },
  { label: 'Date Wise Shipment', path: '/dashboard/date-wise-shipments' },
  { label: 'Product Wise Shipment', path: '/dashboard/product-wise-shipments' },
]

export default function Dashboard() {
  const location = useLocation()
  const { data: stats, isLoading } = useMerchantDashboardStats()

  const statusSeries = stats?.charts?.ordersByStatus || []
  const processed = numberFrom(stats?.operational?.totalOrders)
  const picked = countFromStatus(statusSeries, ['picked'])
  const inTransit = numberFrom(stats?.todayOperations?.inTransit)
  const outForDelivery = countFromStatus(statusSeries, ['out for delivery'])
  const delivered = numberFrom(stats?.operational?.deliveredOrders)
  const rto = numberFrom(stats?.operational?.rtoCount)
  const notPicked = numberFrom(stats?.todayOperations?.pending)
  const cancelled = countFromStatus(statusSeries, ['cancel'])
  const failed = countFromStatus(statusSeries, ['fail'])
  const ndrCount = numberFrom(stats?.actions?.ndrCount)
  const ndrInitiated = numberFrom(stats?.operational?.ndrCount)
  const codOrders = numberFrom(stats?.metrics?.totalCodOrders)
  const prepaidOrders = numberFrom(stats?.metrics?.totalPrepaidOrders)
  const reverseOrders = countFromStatus(statusSeries, ['reverse'])
  const shipmentTypeTotal = codOrders + prepaidOrders + reverseOrders
  const liveShipmentStatuses = sumFromStatuses(statusSeries, (status) => {
    if (!status) {
      return false
    }

    const excludedStatuses = ['deliver', 'rto', 'return', 'cancel', 'fail', 'reverse']
    return !excludedStatuses.some((match) => status.includes(match))
  })
  const liveShipments = Math.max(liveShipmentStatuses, picked, inTransit + outForDelivery)
  const shipmentStatusTotal = delivered + liveShipments + rto
  const deliveredPercent = percentageOf(delivered, shipmentStatusTotal)
  const liveShipmentPercent = percentageOf(liveShipments, shipmentStatusTotal)
  const rtoPercent = percentageOf(rto, shipmentStatusTotal)
  const tatDelivered = Math.max(0, delivered - rto)
  const tatOutside = rto
  const tatPercent = delivered > 0 ? Math.round((tatDelivered / Math.max(1, delivered)) * 100) : 0
  const walletBalance = numberFrom(stats?.financial?.walletBalance)
  const totalRevenue = numberFrom(stats?.financial?.totalRevenue)
  const stateDistributionMap = (stats?.geographic?.topDestinations || []).reduce(
    (acc, item) => {
      const state = String(item.state || '').trim() || 'Unknown'
      acc[state] = (acc[state] || 0) + numberFrom(item.count)
      return acc
    },
    {} as Record<string, number>,
  )
  const stateDistributionBase = Object.entries(stateDistributionMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
  const stateLegendStep = Math.max(
    20,
    Math.ceil((Math.max(...stateDistributionBase.map((item) => item.value), 0) || 20) / 3 / 10) * 10,
  )
  const stateLegendItems = [
    { label: `0 - ${stateLegendStep}`, color: '#808080' },
    { label: `${stateLegendStep} - ${stateLegendStep * 2}`, color: '#000000' },
    { label: `${stateLegendStep * 2} - ${stateLegendStep * 3}`, color: '#FF7F50' },
  ]
  const stateDistribution = stateDistributionBase.map((item) => {
    const color =
      item.value <= stateLegendStep ? '#808080' : item.value <= stateLegendStep * 2 ? '#000000' : '#FF7F50'

    return {
      ...item,
      color,
    }
  })
  const ndrChartSource = (stats?.charts?.ordersByDate || []).slice(-6)
  const ndrSourceTotal = Math.max(
    ndrChartSource.reduce((sum, item) => sum + numberFrom(item.orders), 0),
    1,
  )
  const ndrChartData =
    ndrChartSource.length > 0
      ? ndrChartSource.map((item) => {
          const orderCount = numberFrom(item.orders)
          return {
            label: shortDateLabel(item.date),
            delivered: Math.max(0, Math.round((orderCount / ndrSourceTotal) * delivered)),
            rto: Math.max(0, Math.round((orderCount / ndrSourceTotal) * rto)),
          }
        })
      : Array.from({ length: 6 }, (_, index) => ({
          label: `D${index + 1}`,
          delivered: 0,
          rto: 0,
        }))

  const cardsLeft: DashboardMetricCard[] = [
    {
      title: 'Total Processed',
      value: processed,
      icon: totalProcessedIcon,
      tooltip: 'Total number of shipments created/processed in the selected date range.',
    },
    {
      title: 'Picked',
      value: picked,
      icon: pickedIcon,
      tooltip: 'Shipments successfully picked up by the courier from the pickup location.',
    },
    {
      title: 'In-Transit',
      value: inTransit,
      icon: inTransitIcon,
      tooltip:
        'Shipments currently moving through the courier network, including NDR cases, and not yet out for delivery.',
    },
    {
      title: 'Out for Delivery',
      value: outForDelivery,
      icon: outForDeliveryIcon,
      tooltip: 'Shipments that are with the delivery agent and expected to be delivered soon.',
    },
    {
      title: 'Delivered',
      value: delivered,
      icon: deliveredIcon,
      tooltip: 'Shipments successfully delivered to the customer within the selected date range.',
    },
    {
      title: 'RTO',
      value: rto,
      icon: rtoIcon,
      tooltip: 'Shipments returned back to origin (seller) after failed delivery attempts or rejection.',
    },
  ]

  const cardsRight: DashboardMetricCard[] = [
    {
      title: 'Not Picked',
      value: notPicked,
      icon: <img src={NOT_PICKED_ICON} alt="Not Picked" width="24" />,
      tooltip: 'Shipments created but pickup is still pending and not completed by the courier.',
      className: 'card-tone-pending card-tone-tinted',
    },
    {
      title: 'Cancelled',
      value: cancelled,
      icon: cancelledIcon,
      tooltip: 'Shipments cancelled before delivery due to seller/customer/courier cancellation.',
      className: 'card-tone-cancelled card-tone-tinted',
    },
    {
      title: 'Failed',
      value: failed,
      icon: failedIcon,
      tooltip: 'Shipments that failed due to issues like pickup failure, booking error, or courier rejection.',
      className: 'card-tone-failed card-tone-tinted',
    },
  ]

  if (isLoading && !stats) {
    return (
      <div className="parcelx-dashboard-loading">
        <div className="parcelx-dashboard-spinner" />
        <p>Loading dashboard</p>
      </div>
    )
  }

  return (
    <div className="dashboard___page">
      <div className="dashbaoardnavs">
          <div className="lefts_navs">
            <div className="topnav-btn dashbor">
              <ul>
                {dashboardTabs.map((tab) => {
                  return (
                    <li key={tab.path}>
                      <NavLink
                        end={tab.path === '/dashboard'}
                        className={({ isActive }) => `topnav-btn ${isActive ? 'active' : ''}`.trim()}
                        to={tab.path}
                      >
                        {tab.label === 'Date Wise Shipment' ? (
                          <>
                            Date Wise <span className="d-responsive">Shipment</span>
                          </>
                        ) : tab.label === 'Product Wise Shipment' ? (
                          <>
                            Product Wise <span className="d-responsive">Shipment</span>
                          </>
                        ) : (
                          tab.label
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        <div className="rights_navs dash">
          <ul className="thenavfilters">
            <li>
              <div className="thefiltercate dash dashboard-date-range">
                <div id="DateRangePickerContainer" className="daterangepickercontainer">
                  <div id="DateRangePickerChildren">
                    <ParcelXDateRangePicker placeholder="Select Start Date,Select End Date" />
                  </div>
                </div>
              </div>
            </li>
            <li><div><p className="thefiltercates"><span className="filterimage">{filterGlyph}</span><span className="mt-1">Filters</span></p></div></li>
            <li><div><p className="thefiltercates"><span className="filterimage">{exportGlyph}</span><span className="mt-1">Export</span></p></div></li>
          </ul>
        </div>
      </div>

      {/* Route-based rendering: Show Overview by default, otherwise show nested pages */}
      {location.pathname === '/dashboard' || location.pathname === '/dashboard/' ? (
      <div className="row">
        <div className="col-md-12">
          <div className="cardboexesmains">
            <div className="dashboard-stats-row">
              <div className="dashboard-stats-shell">
                <div className="dashboard-stats-grid">
                  {cardsLeft.map((item) => <DashboardStatCard key={item.title} item={item} />)}
                </div>
              </div>
              <div className="dashboard-stats-tinted-grid">
                {cardsRight.map((item) => <DashboardStatCard key={item.title} item={item} />)}
              </div>
            </div>
          </div>

          <div className="s__show__content">
            <div className="row">
              <div className="col-lg-3 pe-0 dashboard-first-row-card dashboard-first-row-status">
                <div className="delivery-performance-container stat___111 shipment-status-panel d-flex flex-column">
                  <div className="c__0099s topfivee">
                    <div className="thechardheadandfiles">
                      <div className="wrapper-info">
                        <h3 className="thechardsheadings">Shipment Status</h3>
                        <InfoHover
                          className="shipment-status-hover-card"
                          text="This chart shows the overall status of your processed shipments."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="number__donut shipment-status-value">{shipmentStatusTotal || processed}</div>
                  <div className="relative shipmentstatus shipment-status-visual d-flex justify-content-center align-items-center">
                    <ShipmentStatusDonut delivered={delivered} live={liveShipments} rto={rto} />
                  </div>
                  <div className="thecartetails shipment-report shipment-status-legend">
                    <LegendStat
                      label="Delivered"
                      value={delivered}
                      percentage={deliveredPercent}
                      color="rgba(19, 175, 40, 0.6)"
                      accent="rgb(60, 191, 97)"
                      shipmn
                    />
                    <LegendStat
                      label="Live Shipments"
                      value={liveShipments}
                      percentage={liveShipmentPercent}
                      color="rgba(245, 206, 106, 0.698)"
                      accent="rgb(245, 181, 68)"
                      shipmn
                    />
                    <LegendStat
                      label="RTO"
                      value={rto}
                      percentage={rtoPercent}
                      color="rgba(175, 40, 19, 0.75)"
                      accent="rgb(232, 92, 92)"
                      shipmn
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-9 dashboard-first-row-card dashboard-first-row-count">
                <div className="delivery-performance-container s_1144447 h-100 shipment-count-panel">
                  <div className="c__0099s d-flex flex-column h-100">
                    <div className="thechardheadandfiles shipment-countsss">
                      <div className="wrapper-info shipm">
                        <h3 className="thechardsheadings">Shipment Count </h3>
                        <InfoHover text="Day wise trend of shipments" />
                      </div>
                      <div className="wrapper-shipcount">
                        <form className="ant-form ant-form-horizontal css-1261szd">
                          <div className="ant-form-item css-1261szd">
                            <div className="ant-row ant-form-item-row css-1261szd">
                              <div className="ant-col ant-form-item-control css-1261szd">
                                <div className="ant-form-item-control-input">
                                  <div className="ant-form-item-control-input-content">
                                    <SelectStub label="Days" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="theshipmencountgraph mt-auto">
                      <div className="recharts-responsive-container">
                        <div className="recharts-wrapper">
                          <svg className="recharts-surface" viewBox="0 0 707 279">
                            <defs>
                              <clipPath id="recharts18-clip">
                                <rect x="60" y="10" height="229" width="637" />
                              </clipPath>
                            </defs>
                            <g className="recharts-cartesian-grid">
                              <g className="recharts-cartesian-grid-horizontal">
                                <line strokeDasharray="3 3" stroke="#ccc" fill="none" x1="60" y1="10" x2="697" y2="10" />
                                <line strokeDasharray="3 3" stroke="#ccc" fill="none" x1="60" y1="239" x2="697" y2="239" />
                              </g>
                            </g>
                          </svg>
                          <div className="recharts-tooltip-wrapper" tabIndex={-1} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 pe-0 dashboard-second-row-card dashboard-second-row-type">
                <div className="delivery-performance-container stat___111 shipmentype h-100 d-flex flex-column shipment-type-panel">
                  <div className="c__0099s topfivee">
                    <div className="thechardheadandfiles">
                      <div className="wrapper-info">
                        <h3 className="thechardsheadings">Shipment Type</h3>
                        <InfoHover text="This chart shows the payment mode distribution of your processed shipments, including not-picked parcels." />
                      </div>
                    </div>
                  </div>
                  <div className="number__donut">{shipmentTypeTotal}</div>
                  <div className="relative shipment-type flex-grow-1 d-flex justify-content-center align-items-center" style={{ minHeight: 130 }}>
                    <ShipmentTypeDonut cod={codOrders} prepaid={prepaidOrders} reverse={reverseOrders} />
                  </div>
                  <div className="thecartetails mt-auto shipment-type-legend">
                    <LegendStat
                      label="COD"
                      value={codOrders}
                      percentage={percentageOf(codOrders, shipmentTypeTotal)}
                      color="rgba(29, 76, 194, 0.8)"
                      accent="rgb(72, 110, 204)"
                    />
                    <LegendStat
                      label="Prepaid"
                      value={prepaidOrders}
                      percentage={percentageOf(prepaidOrders, shipmentTypeTotal)}
                      color="rgb(15, 39, 98)"
                      accent="rgb(15, 39, 98)"
                    />
                    <LegendStat
                      label="Reverse"
                      value={reverseOrders}
                      percentage={percentageOf(reverseOrders, shipmentTypeTotal)}
                      color="rgb(98, 143, 255)"
                      accent="rgb(98, 143, 255)"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 pe-0 dashboard-second-row-card dashboard-second-row-tat">
                <div className="delivery-performance-container s_1144447 h-100 d-flex flex-column tat-panel">
                  <div className="c__0099s">
                    <div className="thechardheadandfiles">
                      <div className="wrapper-info tat">
                        <h3 className="thechardsheadings">TAT</h3>
                        <InfoHover text="This shows the number of shipments delivered within the default timeframe. The chart includes only forward-delivered shipments." />
                      </div>
                    </div>
                  </div>
                  <div className="number__donut tattss">{tatDelivered}</div>
                  <div className="thearcchaardonut flex-grow-1 d-flex justify-content-center align-items-center flex-column position-relative" style={{ minHeight: 150 }}>
                    <div className="s__0001144" />
                    <EmptyCanvas height={150} width={260} />
                    <div className="thenumnerdonuts">{tatPercent}%</div>
                    <div className="tat-rotating-orbit" />
                    <div className="gauge-small-arc" />
                    <div className="gauge-needle" />
                    <div className="gauge-center-dot" />
                  </div>
                  <div className="thecartetails tat-mt d-block mt-auto">
                    <div className="thelabelinneritems">
                      <div className="theupperinnedetial">
                        <div className="tat-rows">
                          <div className="tat-row">
                            <div className="tatszs">
                              <span className="thelabellsscolores withtatlable" />
                              <span className="thetatlabels">WITHIN TAT</span>
                            </div>
                            <span className="tthetatnumbs">{tatDelivered}</span>
                          </div>
                          <div className="tat-row">
                            <div className="tatszs">
                              <span className="thelabellsscolores outstatlable" />
                              <span className="thetatlabels">OUTSIDE TAT</span>
                            </div>
                            <span className="tthetatnumbs">{tatOutside}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 dashboard-second-row-card dashboard-second-row-ndr">
                <div className="delivery-performance-container s_1144447 nondel h-100 ndr-panel">
                  <div className="c__0099s d-flex flex-column h-100">
                    <div className="thechardheadandfiles">
                      <div className="flex items-center thecollmeonflesd">
                        <div className="wrapper-info ndr">
                          <h3 className="thechardsheadings">NDR Report </h3>
                          <InfoHover
                            text={
                              <>
                                This shows the non-delivery status of processed shipments.
                                <br />
                                <b>NDR Count:</b> Number of shipments with NDR
                                <br />
                                <b>NDR Initiated:</b> Number of shipments where action has been taken
                              </>
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center theooopttoionss thecollmeonflesd">
                        <div className="legend-chip">
                          <span className="legend-dot delivered-dot" />
                          <span className="text-sm">Delivered</span>
                        </div>
                        <div className="legend-chip rto">
                          <span className="legend-dot rto-dot" />
                          <span className="text-sm">RTO</span>
                        </div>
                      </div>
                    </div>
                    <div className="thechardiifdatas">
                      <div className="thecharcardds">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="thendrdataname">NDR Count</p>
                            <p className="thendrdatanum">{ndrCount}</p>
                          </div>
                          <span className="thendrdataicons">{ndrCountIcon}</span>
                        </div>
                      </div>
                      <div className="thecharcardds">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="thendrdataname">NDR Initiated</p>
                            <p className="thendrdatanum">{ndrInitiated}</p>
                          </div>
                          <span className="thendrdataicons">{ndrInitiatedIcon}</span>
                        </div>
                      </div>
                    </div>
                    <div className="thebarchharts mt-auto">
                      <NdrReportChart data={ndrChartData} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="chart-statewise zone-wise" style={{ paddingTop: 5 }}>
                  <div className="zone-wise-head" style={{ margin: '1rem auto' }}>
                    <h3 className="thechardsheadings">Zone Wise Shipments</h3>
                  </div>
                  <div className="zone-wise-canvas" style={{ height: 420 }}>
                    <EmptyCanvas height={630} width={1018} />
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div>
                  <div className="thelogistablemore">
                    <div className="c__0099s">
                      <div className="thechardheadandfiles d-block">
                        <div className="logistics-wrapper">
                          <h3 className="thechardsheadings">Logistics wise Distributions </h3>
                          <InfoHover text="Courier wise COD Prepaid distribution." />
                        </div>
                      </div>
                    </div>
                    <div className="max-w-[1400px] mx-auto">
                      <div className="text-center text-gray-500 py-4">No courier data available for the selected period</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="chart-statewise">
                  <div className="c__0099s">
                    <div className="thechardheadandfiles orderdistribution">
                      <div className="wrapper-info shipm">
                        <h3 className="thechardsheadings">Order Distribution</h3>
                        <InfoHover text="Number of shipments getting delivered area wise." />
                      </div>
                      <div className="top-tenstates-main">
                        <div className="ant-select ant-select-outlined css-1261szd ant-select-single ant-select-show-arrow top-ten-select">
                          <div className="ant-select-selector">
                            <span className="ant-select-selection-wrap">
                              <span className="ant-select-selection-search">
                                <input type="search" autoComplete="off" className="ant-select-selection-search-input" role="combobox" aria-expanded="false" aria-haspopup="listbox" readOnly value="" />
                              </span>
                              <span className="ant-select-selection-item" title="Top 10 States">Top 10 States</span>
                            </span>
                          </div>
                          <span className="ant-select-arrow" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="theinnerstaegraph row m-0">
                      <div className="col-md-11">
                        <div className="order-distribution-canvas">
                          {stateDistribution.length > 0 ? (
                            <OrderDistributionChart data={stateDistribution} />
                          ) : (
                            <div className="order-distribution-empty">No state-wise shipment data available</div>
                          )}
                        </div>
                      </div>
                      <div className="legendstyle col-md-1 d-block">
                        {stateLegendItems.map((item) => (
                          <span
                            key={item.label}
                            className="child-legend mb-2"
                            style={{ background: item.color }}
                          >
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 pe-0">
                <div className="delivery-performance-container h-100 total-revenue-panel">
                  <div className="thechardheadandfiles totalrevenue">
                    <div className="c__0099s">
                      <div className="wrapper-info produ">
                        <h3 className="thechardsheadings">Total Revenue</h3>
                        <InfoHover text="Total order value of delivered shipments in the selected date range." />
                      </div>
                      <div className="number__donut mt-2">₹{totalRevenue.toLocaleString('en-IN')}</div>
                    </div>
                    <form className="ant-form ant-form-horizontal css-1261szd">
                      <div className="ant-form-item css-1261szd">
                        <div className="ant-row ant-form-item-row css-1261szd">
                          <div className="ant-col ant-form-item-control css-1261szd">
                            <div className="ant-form-item-control-input">
                              <div className="ant-form-item-control-input-content">
                                <SelectStub label="Month" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="total-revenue-empty" style={{ height: 280, marginTop: 10 }}>
                    <div className="flex items-center justify-center h-full text-gray-500">No valid data available</div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 ps-2">
                <div className="row h-100">
                  <div className="col-md-6 pe-1">
                    <div className="delivery-performance-container s_1144447 thesecondsryyss h-100">
                      <div className="c__0099s topfive">
                        <div className="thechardheadandfiles">
                          <div className="wrapper-info produ">
                            <h3 className="thechardsheadings">Top 05 Products </h3>
                            <InfoHover text="Products with the highest orders in the selected date range." />
                          </div>
                        </div>
                      </div>
                      <div className="thetotalsproducts">
                        <div className="flex items-center justify-center h-24 text-gray-500">No product data available</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 ps-1">
                    <div className="delivery-performance-container s_1144447 thesecondsryyss h-100">
                      <div className="c__0099s topfive">
                        <div className="thechardheadandfiles">
                          <div className="wrapper-info produ">
                            <h3 className="thechardsheadings">Top 05 Customers </h3>
                            <InfoHover text="Customers with the most orders in the selected date range." className="top-customer" />
                          </div>
                        </div>
                      </div>
                      <div className="thetotalsproducts">
                        <div className="flex items-center justify-center h-24 text-gray-500">No customer data available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="dashboard-nested-content" style={{ marginTop: '20px' }}>
          <Outlet />
        </div>
      )}
    </div>
  )
}
