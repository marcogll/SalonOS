import type { BusinessHours, DayHours } from '@/lib/db/types'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
type DayOfWeek = typeof DAYS[number]

export function getDayOfWeek(date: Date): DayOfWeek {
  return DAYS[date.getDay()]
}

export function isOpenNow(businessHours: BusinessHours, date = new Date): boolean {
  const day = getDayOfWeek(date)
  const hours = businessHours[day]

  if (!hours || hours.is_closed) {
    return false
  }

  const now = date
  const [openHour, openMinute] = hours.open.split(':').map(Number)
  const [closeHour, closeMinute] = hours.close.split(':').map(Number)

  const openTime = new Date(now)
  openTime.setHours(openHour, openMinute, 0, 0)

  const closeTime = new Date(now)
  closeTime.setHours(closeHour, closeMinute, 0, 0)

  return now >= openTime && now < closeTime
}

export function getNextOpenTime(businessHours: BusinessHours, from = new Date): Date | null {
  const checkDate = new Date(from)

  for (let i = 0; i < 7; i++) {
    const day = getDayOfWeek(checkDate)
    const hours = businessHours[day]

    if (hours && !hours.is_closed) {
      const [openHour, openMinute] = hours.open.split(':').map(Number)

      const openTime = new Date(checkDate)
      openTime.setHours(openHour, openMinute, 0, 0)

      if (openTime > from) {
        return openTime
      }

      openTime.setDate(openTime.getDate() + 1)
      return openTime
    }

    checkDate.setDate(checkDate.getDate() + 1)
  }

  return null
}

export function isTimeWithinHours(time: string, dayHours: DayHours): boolean {
  if (dayHours.is_closed) {
    return false
  }

  const [hour, minute] = time.split(':').map(Number)
  const checkMinutes = hour * 60 + minute

  const [openHour, openMinute] = dayHours.open.split(':').map(Number)
  const [closeHour, closeMinute] = dayHours.close.split(':').map(Number)
  const openMinutes = openHour * 60 + openMinute
  const closeMinutes = closeHour * 60 + closeMinute

  return checkMinutes >= openMinutes && checkMinutes < closeMinutes
}

export function getBusinessHoursString(dayHours: DayHours): string {
  if (dayHours.is_closed) {
    return 'Cerrado'
  }
  return `${dayHours.open} - ${dayHours.close}`
}

export function getTodayHours(businessHours: BusinessHours): string {
  const day = getDayOfWeek(new Date())
  return getBusinessHoursString(businessHours[day])
}
