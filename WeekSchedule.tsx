import React from 'react';
import styles from './WeekSchedule.module.css'; // Importing styles as a module

const HOURS = [
  '0:00', '1:00', '2:00', '3:00', '4:00', '5:00',
  '6:00', '7:00', '8:00', '9:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

const DAYS = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];


type Range = { dateFrom: string; dateTo: string };
type Slot = { day: number; hour: number };

function getWeekStart(date: Date) {
  // Zwraca datę poniedziałku dla danego tygodnia (UTC)
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function isSameWeek(date: Date, weekStart: Date) {
  // Sprawdza czy data należy do tygodnia rozpoczynającego się weekStart
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return d >= weekStart && d < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
}

function getSlotsFromRanges(ranges: Range[], weekStart: Date): Slot[] {
  const slots: Slot[] = [];
  ranges.forEach(({ dateFrom, dateTo }) => {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    let current = new Date(start);
    while (current <= end) {
      if (isSameWeek(current, weekStart)) {
        const day = (current.getUTCDay() + 6) % 7;
        const hour = current.getUTCHours();
        slots.push({ day, hour });
      }
      current.setUTCHours(current.getUTCHours() + 1);
    }
  });
  return slots;
}

const WeekSchedule = ({ data = [] }) => {
  // Wyznacz tydzień na podstawie pierwszego rekordu
  const firstDate = data[0].dateFrom ? new Date(data[0].dateFrom) : new Date();
  const weekStart = getWeekStart(firstDate);
  // Przetwórz zakresy na sloty tylko z tego tygodnia
  const slots = getSlotsFromRanges(data, weekStart);
  // Tworzymy mapę dla szybkiego sprawdzania
  const slotMap = new Set(slots.map(s => `${s.hour}-${s.day}`));

  return (
      
      <div className={styles.scheduleGrid} aria-label="Weekly schedule grid">
        <div className={styles.header}></div>
        {DAYS.map((day, index) => (
          <div key={index} className={styles.header}>{day}</div>
        ))}

        {HOURS.map((hour, hourIndex) => (
          <React.Fragment key={hourIndex}>
            <div className={hourIndex % 8 === 0 ? `${styles.hour} ${styles.show}` : styles.hour}>
              {hourIndex % 8 === 0 ? hour : ''}
            </div>
            {DAYS.map((dayLabel, dayIndex) => {
              const isActive = slotMap.has(`${hourIndex}-${dayIndex}`);
              const [showTooltip, setShowTooltip] = React.useState(false);
              return (
                <div
                  key={`${hourIndex}-${dayIndex}`}
                  className={isActive ? `${styles.cell} ${styles.active}` : styles.cell}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  style={{ position: 'relative' }}
                >
                  {showTooltip && (
                    <div className={styles.tooltip}>
                      {HOURS[hourIndex]}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Wiersz z 23:59 */}
        <div className={styles.hour}>23:59</div>
        {DAYS.map((_, dayIndex) => (
          <div key={`2359-${dayIndex}`} className={styles.cell} style={{background: 'transparent', pointerEvents: 'none'}}></div>
        ))}
      </div>
  );
};

export default WeekSchedule;
