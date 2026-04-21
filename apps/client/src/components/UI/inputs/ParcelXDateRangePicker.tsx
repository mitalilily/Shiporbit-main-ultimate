import { Popover } from '@mui/material'
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parse,
  set,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'
import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { FiCalendar, FiClock } from 'react-icons/fi'

export type RangeValue = {
  start: Date
  end: Date
}

type PresetKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom'

interface ParcelXDateRangePickerProps {
  value?: RangeValue
  onApply?: (range: RangeValue) => void
  placeholder?: string
  inputClassName?: string
  wrapperClassName?: string
  icon?: ReactNode
}

type DraftPanel = 'start' | 'end'

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const getDefaultRange = (): RangeValue => ({
  start: startOfDay(subDays(new Date(), 30)),
  end: endOfDay(new Date()),
})

const formatInputValue = (range: RangeValue) =>
  `${format(range.start, 'dd-MMM-yyyy hh:mm aa').toLowerCase()} - ${format(range.end, 'dd-MMM-yyyy hh:mm aa').toLowerCase()}`

const formatDateTimeField = (value: Date) => format(value, 'yyyy-MM-dd hh:mm aa').toLowerCase()

const getPresetRange = (preset: PresetKey): RangeValue => {
  const now = new Date()

  switch (preset) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) }
    case 'yesterday': {
      const day = subDays(now, 1)
      return { start: startOfDay(day), end: endOfDay(day) }
    }
    case 'last7':
      return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) }
    case 'last30':
      return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) }
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfDay(now) }
    case 'lastMonth': {
      const month = subMonths(now, 1)
      return { start: startOfMonth(month), end: endOfMonth(month) }
    }
    case 'custom':
    default:
      return getDefaultRange()
  }
}

const clampRange = (range: RangeValue): RangeValue => {
  const maxDate = endOfDay(new Date())
  const start = isAfter(range.start, maxDate) ? startOfDay(maxDate) : range.start
  const safeEnd = isAfter(range.end, maxDate) ? maxDate : range.end
  const end = isBefore(safeEnd, start) ? endOfDay(start) : safeEnd
  return { start, end }
}

const buildCalendarDays = (visibleMonth: Date) => {
  const monthStart = startOfMonth(visibleMonth)
  const monthEnd = endOfMonth(visibleMonth)
  const startWeekday = (monthStart.getDay() + 6) % 7
  const gridStart = subDays(monthStart, startWeekday)
  const endWeekday = (monthEnd.getDay() + 6) % 7
  const gridEnd = addDays(monthEnd, 6 - endWeekday)
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

const setTimePart = (date: Date, key: 'hour' | 'minute' | 'meridiem', rawValue: string) => {
  const hours24 = date.getHours()
  const currentHour12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const isPm = hours24 >= 12

  let nextHour12 = currentHour12
  let nextMinute = date.getMinutes()
  let nextMeridiem = isPm ? 'pm' : 'am'

  if (key === 'hour') nextHour12 = Number(rawValue)
  if (key === 'minute') nextMinute = Number(rawValue)
  if (key === 'meridiem') nextMeridiem = rawValue as 'am' | 'pm'

  let nextHours24 = nextHour12 % 12
  if (nextMeridiem === 'pm') nextHours24 += 12

  return set(date, {
    hours: nextHours24,
    minutes: nextMinute,
    seconds: key === 'minute' ? 0 : date.getSeconds(),
    milliseconds: 0,
  })
}

export default function ParcelXDateRangePicker({
  value,
  onApply,
  placeholder = 'Select Date Range',
  inputClassName = 'custom-range-picker',
  wrapperClassName = 'date-wrapper',
  icon,
}: ParcelXDateRangePickerProps) {
  const initialRange = useMemo(() => clampRange(value ?? getDefaultRange()), [value])
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [appliedRange, setAppliedRange] = useState<RangeValue>(initialRange)
  const [draftRange, setDraftRange] = useState<RangeValue>(initialRange)
  const [activePreset, setActivePreset] = useState<PresetKey>('custom')
  const [activePanel, setActivePanel] = useState<DraftPanel>('start')
  const [visibleMonthStart, setVisibleMonthStart] = useState(startOfMonth(initialRange.start))
  const [visibleMonthEnd, setVisibleMonthEnd] = useState(startOfMonth(initialRange.end))

  const open = Boolean(anchorEl)
  const maxDate = endOfDay(new Date())

  useEffect(() => {
    const nextRange = clampRange(value ?? getDefaultRange())
    setAppliedRange(nextRange)
    setDraftRange(nextRange)
    setVisibleMonthStart(startOfMonth(nextRange.start))
    setVisibleMonthEnd(startOfMonth(nextRange.end))
  }, [value])

  const openPicker = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setDraftRange(appliedRange)
    setVisibleMonthStart(startOfMonth(appliedRange.start))
    setVisibleMonthEnd(startOfMonth(appliedRange.end))
  }

  const closePicker = () => setAnchorEl(null)

  const updateRange = (nextRange: RangeValue) => {
    const clamped = clampRange(nextRange)
    setDraftRange(clamped)
    if (!isSameMonth(visibleMonthStart, clamped.start)) {
      setVisibleMonthStart(startOfMonth(clamped.start))
    }
    if (!isSameMonth(visibleMonthEnd, clamped.end)) {
      setVisibleMonthEnd(startOfMonth(clamped.end))
    }
  }

  const handlePresetClick = (preset: PresetKey) => {
    setActivePreset(preset)
    if (preset === 'custom') return
    updateRange(getPresetRange(preset))
  }

  const handleDaySelect = (panel: DraftPanel, day: Date) => {
    if (isAfter(startOfDay(day), maxDate)) return

    if (panel === 'start') {
      const start = set(day, {
        hours: draftRange.start.getHours(),
        minutes: draftRange.start.getMinutes(),
        seconds: 0,
        milliseconds: 0,
      })

      updateRange({
        start,
        end: isBefore(draftRange.end, start) ? endOfDay(start) : draftRange.end,
      })
      setActivePanel('end')
      setActivePreset('custom')
      return
    }

    const end = set(day, {
      hours: draftRange.end.getHours(),
      minutes: draftRange.end.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    })

    updateRange({
      start: isAfter(draftRange.start, end) ? startOfDay(end) : draftRange.start,
      end,
    })
    setActivePreset('custom')
  }

  const handleTimeChange = (panel: DraftPanel, key: 'hour' | 'minute' | 'meridiem', rawValue: string) => {
    const current = panel === 'start' ? draftRange.start : draftRange.end
    const next = setTimePart(current, key, rawValue)
    updateRange({
      start: panel === 'start' ? next : draftRange.start,
      end: panel === 'end' ? next : draftRange.end,
    })
    setActivePreset('custom')
  }

  const handleDateInputChange = (panel: DraftPanel, rawValue: string) => {
    const parsed = parse(rawValue, 'yyyy-MM-dd hh:mm aa', new Date())
    if (Number.isNaN(parsed.getTime())) return
    updateRange({
      start: panel === 'start' ? parsed : draftRange.start,
      end: panel === 'end' ? parsed : draftRange.end,
    })
    setActivePreset('custom')
  }

  const applyDraft = () => {
    const finalRange = clampRange(draftRange)
    setAppliedRange(finalRange)
    onApply?.(finalRange)
    closePicker()
  }

  const cancelDraft = () => {
    setDraftRange(appliedRange)
    setVisibleMonthStart(startOfMonth(appliedRange.start))
    setVisibleMonthEnd(startOfMonth(appliedRange.end))
    closePicker()
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    setAnchorEl(event.currentTarget)
    setDraftRange(appliedRange)
    setVisibleMonthStart(startOfMonth(appliedRange.start))
    setVisibleMonthEnd(startOfMonth(appliedRange.end))
  }

  const renderCalendarPanel = (panel: DraftPanel, visibleMonth: Date, setVisibleMonth: (date: Date) => void) => {
    const currentDate = panel === 'start' ? draftRange.start : draftRange.end
    const calendarDays = buildCalendarDays(visibleMonth)
    const selectedInterval =
      isBefore(draftRange.start, draftRange.end) || isSameDay(draftRange.start, draftRange.end)
        ? { start: startOfDay(draftRange.start), end: startOfDay(draftRange.end) }
        : null

    return (
      <div className="fromDateTimeContainer">
        <div className="fromDateHourContainer">
          <div className="dateTimeLabel">{panel === 'start' ? 'From Date' : 'To Date'}</div>
          <span className="input-group" style={{ cursor: 'pointer' }}>
            <span className="calendarAddon input-group-addon">
              <FiCalendar />
            </span>
            <input
              type="text"
              className="inputDate form-control"
              value={formatDateTimeField(currentDate)}
              onChange={(event) => handleDateInputChange(panel, event.target.value)}
              onFocus={() => setActivePanel(panel)}
            />
          </span>
          <div className="timeContainer">
            <div className="timeSelectContainer">
              <div className="multipleContentOnLine">
                <select
                  value={String(currentDate.getHours() % 12 === 0 ? 12 : currentDate.getHours() % 12)}
                  onChange={(event) => handleTimeChange(panel, 'hour', event.target.value)}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
              <div className="multipleContentOnLine">:</div>
              <div className="multipleContentOnLine">
                <select
                  value={String(currentDate.getMinutes())}
                  onChange={(event) => handleTimeChange(panel, 'minute', event.target.value)}
                >
                  {Array.from({ length: 60 }, (_, index) => index).map((minute) => (
                    <option key={minute} value={minute}>
                      {String(minute).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="multipleContentOnLine">
                <select
                  value={currentDate.getHours() >= 12 ? 'pm' : 'am'}
                  onChange={(event) => handleTimeChange(panel, 'meridiem', event.target.value)}
                >
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </div>
            </div>
            <span className="timeIconStyle" aria-hidden="true">
              <FiClock size={14} />
            </span>
          </div>
        </div>

        <div>
          <div className="monthYearContainer">
            <div className="multipleContentOnLine leftChevron" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}>
              <span>{'<'}</span>
            </div>
            <div className="multipleContentOnLine">
              <select
                value={visibleMonth.getMonth()}
                onChange={(event) =>
                  setVisibleMonth(new Date(visibleMonth.getFullYear(), Number(event.target.value), 1))
                }
              >
                {monthOptions.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="multipleContentOnLine">
              <select
                value={visibleMonth.getFullYear()}
                onChange={(event) =>
                  setVisibleMonth(new Date(Number(event.target.value), visibleMonth.getMonth(), 1))
                }
              >
                {Array.from({ length: 137 }, (_, index) => 1900 + index).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="multipleContentOnLine rightChevron" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}>
              <span>{'>'}</span>
            </div>
          </div>

          <div className="calendarGrid calendarGridHead">
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
            <div>Su</div>
          </div>

          <div>
            {Array.from({ length: calendarDays.length / 7 }, (_, rowIndex) => (
              <div key={`${panel}-row-${rowIndex}`} className="calendarGrid">
                {calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((day) => {
                  const outsideMonth = !isSameMonth(day, visibleMonth)
                  const disabled = isAfter(startOfDay(day), maxDate)
                  const selectedStart = isSameDay(day, draftRange.start)
                  const selectedEnd = isSameDay(day, draftRange.end)
                  const inRange = selectedInterval
                    ? isWithinInterval(startOfDay(day), selectedInterval)
                    : false

                  const className = [
                    'calendarCell',
                    outsideMonth ? 'outside-month' : '',
                    inRange ? 'in-range' : '',
                    selectedStart ? 'selected-start' : '',
                    selectedEnd ? 'selected-end' : '',
                    disabled ? 'disabled-cell' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <div
                      key={`${panel}-${day.toISOString()}`}
                      className={className}
                      tabIndex={disabled ? -1 : 0}
                      onClick={() => !disabled && handleDaySelect(panel, day)}
                      onKeyDown={(event) => {
                        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault()
                          handleDaySelect(panel, day)
                        }
                      }}
                    >
                      {format(day, 'd')}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="activeNotifier">
          {activePanel === panel ? `Selecting ${panel === 'start' ? 'From' : 'To'}` : panel === 'start' ? 'From' : 'To'}
          <span className={`dot ${activePanel === panel ? 'active' : ''}`} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={wrapperClassName} role="button" tabIndex={0} onClick={openPicker} onKeyDown={handleTriggerKeyDown}>
        <input
          placeholder={placeholder}
          readOnly
          className={`ant-input ant-input-outlined ${inputClassName}`.trim()}
          type="text"
          value={formatInputValue(appliedRange)}
        />
        <span className="calender_0099">{icon ?? <FiCalendar size={16} />}</span>
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={cancelDraft}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          id: 'daterangepicker',
          className: 'daterangepicker-paper',
          sx: {
            mt: 0.8,
            overflow: 'visible',
            boxShadow: '0 20px 48px rgba(16, 24, 40, 0.18)',
            borderRadius: '14px',
          },
        }}
      >
        <div id="daterangepicker" className="daterangepicker">
          <div className="rangecontainer">
            {[
              ['today', 'Today'],
              ['yesterday', 'Yesterday'],
              ['last7', 'Last 7 Days'],
              ['last30', 'Last 30 Days'],
              ['thisMonth', 'This Month'],
              ['lastMonth', 'Last Month'],
              ['custom', 'Custom Range'],
            ].map(([key, label]) => (
              <div
                key={key}
                className={`rangeButton ${activePreset === key ? 'active' : ''}`.trim()}
                role="button"
                tabIndex={0}
                onClick={() => handlePresetClick(key as PresetKey)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handlePresetClick(key as PresetKey)
                  }
                }}
              >
                <div className="rangebuttontextstyle">{label}</div>
              </div>
            ))}
          </div>

          {renderCalendarPanel('start', visibleMonthStart, setVisibleMonthStart)}
          {renderCalendarPanel('end', visibleMonthEnd, setVisibleMonthEnd)}

          <div id="buttonContainer" className="buttonContainer">
            <div className="maxDateLabel">Max Date: {formatDateTimeField(maxDate)}</div>
            <div className="buttonSeperator applyButton" role="button" tabIndex={0} onClick={applyDraft}>
              Apply
            </div>
            <div className="buttonSeperator cancelButton" role="button" tabIndex={0} onClick={cancelDraft}>
              Cancel
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}
