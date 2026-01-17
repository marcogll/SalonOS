import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  minDate?: Date
  disabled?: boolean
}

export default function DatePicker({ selectedDate, onDateSelect, minDate, disabled }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate) : new Date())

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const isDateDisabled = (date: Date) => {
    if (minDate) {
      return date < minDate
    }
    return false
  }

  const isDateSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={previousMonth}
          disabled={disabled}
          className="p-2 hover:bg-[var(--mocha-taupe)]/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--charcoal-brown)' }} />
        </button>
        <h3 className="text-lg font-medium" style={{ color: 'var(--charcoal-brown)' }}>
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          disabled={disabled}
          className="p-2 hover:bg-[var(--mocha-taupe)]/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" style={{ color: 'var(--charcoal-brown)' }} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium py-2"
            style={{ color: 'var(--mocha-taupe)' }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const disabled = isDateDisabled(date)
          const selected = isDateSelected(date)
          const today = isToday(date)
          const notCurrentMonth = !isSameMonth(date, currentMonth)

          return (
            <button
              key={index}
              type="button"
              onClick={() => !disabled && !notCurrentMonth && onDateSelect(date)}
              disabled={disabled || notCurrentMonth}
              className={`
                relative p-2 text-sm font-medium rounded-md transition-all
                ${disabled || notCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-[var(--mocha-taupe)]/10'}
                ${selected ? 'text-white' : ''}
                ${today && !selected ? 'font-bold' : ''}
              `}
              style={selected ? { background: 'var(--deep-earth)' } : { color: 'var(--charcoal-brown)' }}
            >
              {format(date, 'd')}
              {today && !selected && (
                <span
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--deep-earth)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}