import React, { useState } from 'react'
import styles from './WeekSchedule.module.css' // Importing styles as a module
import { Button, Stack } from '@mantine/core'

const HOURS = [
  '0:00',
  '1:00',
  '2:00',
  '3:00',
  '4:00',
  '5:00',
  '6:00',
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

const DAYS = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N']

type Range = { dateFrom: string; dateTo: string }
type Slot = { day: number; hour: number }

function getWeekStart(date: Date) {
  // Zwraca datę poniedziałku dla danego tygodnia
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

function getweeknumFromDate(date: Date) {
  const start = getWeekStart(date) // poniedziałek tego tygodnia
  const out = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const day = d.getDate().toString()
    const month = d.getMonth().toString()
    out.push({day, month, date: d})
  }
  return out
}

function getFullDayName(short: number) {
  switch (short) {
    case 0:
      return 'Poniedziałek'
    case 1:
      return 'Wtorek'
    case 2:
      return 'Środa'
    case 3:
      return 'Czwartek'
    case 4:
      return 'Piątek'
    case 5:
      return 'Sobota'
    case 6:
      return 'Niedziela'
    default:
      return short
  }
}

function isSameWeek(date: Date, weekStart: Date) {
  // Sprawdza czy data należy do tygodnia rozpoczynającego się weekStart
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return d >= weekStart && d < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
}

function getSlotsFromRanges(ranges: Range[], weekStart: Date): Slot[] {
  const slots: Slot[] = []
  ranges.forEach(({ dateFrom, dateTo }) => {
    const start = new Date(dateFrom)
    const end = new Date(dateTo)
    const current = new Date(start)
    while (current <= end) {
      if (isSameWeek(current, weekStart)) {
        const day = (current.getDay() + 6) % 7
        const hour = current.getHours()
        slots.push({ day, hour })
      }
      current.setHours(current.getHours() + 1)
    }
  })
  return slots
}

type DaySegmentProps = {
  hourIndex: number
  dayIndex: number
  slotMap: Set<string>
  selectedslotMap?: Set<string>
  onClick?: () => void
  active?: (value: boolean) => void
}

const DaySegment = ({
  hourIndex,
  dayIndex,
  slotMap,
  selectedslotMap,
  onClick,
}: DaySegmentProps) => {
  const isActive = slotMap.has(`${hourIndex}-${dayIndex}`)
  const isSelected = selectedslotMap?.has(`${hourIndex}-${dayIndex}`) || false
  const [showTooltip, setShowTooltip] = useState(false)
  const hourClass = `cell--hour-${hourIndex}`
  
  return (
    <div
      key={`${hourIndex}-${dayIndex}`}
      className={[
        styles.cell,
        isActive ? styles.active : '',
        isSelected ? styles.selected : '',
        hourClass,
      ].join(' ')}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
      style={{ position: 'relative' }}
    >
      {showTooltip && <div className={styles.tooltip}>{HOURS[hourIndex]}</div>}
    </div>
  )
}

const HourlyDisplay = ({ display = 8 }: { display?: number }) => {
  return (
    <div className={styles.hourlyDisplay}>
      {HOURS.map((hour, index) => (
        <div key={index} className={styles.hour}>
          {index % display === 0 ? hour : null}
        </div>
      ))}
    </div>
  )
}

type WeekScheduleProps = {
  data: Range | Range[]
  tdata?: Range | Range[]
  showDay?: boolean
  showMonth?: boolean
  defaultDate?: Date
  onSetStartDate?: (date: Date | null) => void
  onSetEndDate?: (date: Date | null) => void
}

const WeekSchedule = ({
  data = [],
  tdata = { dateFrom: '0000-00-00T00:00:00.000+00:00', dateTo: '0000-00-00T00:00:00.000+00:00' },
  showDay: showday = false,
  showMonth: showmonth = false,
  onSetStartDate,
  onSetEndDate,
  defaultDate = new Date(),
}: WeekScheduleProps) => {
  const [showMoreInfo, setMoreInfo] = useState({
    enabled: false,
    date: { hour: '', dayIndex: 0, fullDate: {} },
    avilable: false,
  })
  data = Array.isArray(data) ? data : [data]

  // Wyznacz tydzień na podstawie pierwszego rekordu
  const firstDate = data[0]?.dateFrom ? new Date(data[0].dateFrom) : defaultDate
  const weekStart = getWeekStart(firstDate)
  // Przetwórz zakresy na sloty tylko z tego tygodnia
  const slots = getSlotsFromRanges(data, weekStart)
  const tdataRange = Array.isArray(tdata) ? tdata : [tdata]
  const selectedSlots = getSlotsFromRanges(tdataRange, weekStart)
  // Tworzymy mapę dla szybkiego sprawdzania
  const slotMap = new Set(slots.map((s) => `${s.hour}-${s.day}`))
  const selectedslotMap = new Set(selectedSlots.map((s) => `${s.hour}-${s.day}`))

  return (
    <>
      <div className={styles.weekSchedule}>
        <HourlyDisplay display={2} />

        <div className={styles.scheduleGrid} aria-label="Weekly schedule grid">
          {DAYS.map((day, index) => (
            <div key={index} className={styles.header}>
              {day}

              <p className={styles.hour} style={{ textAlign: 'center' }}>
                {showday && getweeknumFromDate(weekStart)[index].day.padStart(2,"0")} {(showmonth && showday) && '-'}{showmonth && getweeknumFromDate(weekStart)[index].month.padStart(2,"0")}
              </p>
            </div>
          ))}

          {HOURS.map((hour, hourIndex) => (
            <React.Fragment key={hourIndex}>
              {DAYS.map((_, dayIndex) => {
                const isActive = slotMap.has(`${hourIndex}-${dayIndex}`)
                return (
                  <DaySegment
                    onClick={() =>
                      setMoreInfo({
                        enabled: true,
                        date: { hour, dayIndex: dayIndex, fullDate: getweeknumFromDate(weekStart)[dayIndex] },
                        avilable: isActive,
                      })
                    }
                    key={`${hourIndex}-${dayIndex}`}
                    hourIndex={hourIndex}
                    dayIndex={dayIndex}
                    slotMap={slotMap}
                    selectedslotMap={selectedslotMap}
                  />
                )
              })}
            </React.Fragment>
          ))}
        </div>
        <HourlyDisplay display={3} />
      </div>
      {showMoreInfo.enabled && (
        <div className={styles.moreInfo}>
          <div>
            <p>
               {showMoreInfo.date.fullDate.day.toString().padStart(2,"0")}-{showMoreInfo.date.fullDate.month.toString().padStart(2,"0")} {getFullDayName(showMoreInfo.date.dayIndex)} {showMoreInfo.date.hour}
            </p>
            <p>{!showMoreInfo.avilable ? 'Termin dostępny' : 'Termin niedostępny'}</p>
          </div>

          <div>
            <Stack>
              <Button
                onClick={() => {
                  if (onSetStartDate) {
                    const date = new Date(weekStart)
                    date.setDate((showMoreInfo.date.fullDate.date as Date).getDate())
                    date.setHours(parseInt(showMoreInfo.date.hour as string, 10)-2)
                    onSetStartDate(date)
                  }
                }}
              >
                Ustaw datę początkową
              </Button>
              <Button
                onClick={() => {
                  if (onSetEndDate) {
                    const date = new Date(weekStart)
                    date.setDate((showMoreInfo.date.fullDate.date as Date).getDate())
                    date.setHours(parseInt(showMoreInfo.date.hour as string, 10)-2)
                    onSetEndDate(date)
                  }
                }}
              >
                Ustaw datę Końcową
              </Button>
            </Stack>
          </div>
        </div>
      )}
    </>
  )
}

export default WeekSchedule
 
